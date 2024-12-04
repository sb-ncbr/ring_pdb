import { PluginUIContext } from 'molstar/lib/commonjs/mol-plugin-ui/context';
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/commonjs/mol-plugin-ui/spec';
import { Color } from 'molstar/lib/commonjs/mol-util/color';
import { Model, QueryContext, StructureSelection } from 'molstar/lib/commonjs/mol-model/structure';
import { MolScriptBuilder as MS } from 'molstar/lib/mol-script/language/builder';
import { compile } from 'molstar/lib/commonjs/mol-script/runtime/query/base';
import { StructureSelectionQuery } from 'molstar/lib/commonjs/mol-plugin-state/helpers/structure-selection-query';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { StateObjectCell } from 'molstar/lib/commonjs/mol-state';
import { setSubtreeVisibility } from 'molstar/lib/commonjs/mol-plugin/behavior/static/state';
import { InitVolumeStreaming } from 'molstar/lib/commonjs/mol-plugin/behavior/dynamic/volume-streaming/transformers';
import { Expression } from 'molstar/lib/commonjs/mol-script/language/expression';

interface RingSelection {
  chainId: string;
  compId: string;
  residueId: number;
  atomIds: string[];
}

interface CellRefs {
  assembly?: StateObjectCell;
  polymer?: {
    cartoon?: StateObjectCell;
    bas?: StateObjectCell;
  };
  ligand?: StateObjectCell;
  ring?: StateObjectCell;
  volumeStreaming?: string;
}

export default class MolstarViewerModel {
  private readonly _plugin: PluginUIContext;
  private readonly _volumeStreamingTag = 'volume-streaming';
  private _cellRefs: CellRefs = {};
  private _subscriptions: Subscription[] = [];

  public state = {
    showControls: new BehaviorSubject<boolean>(false),
    isExpanded: new BehaviorSubject<boolean>(false),
    isInitialized: new BehaviorSubject<boolean>(false),
    isLoading: new BehaviorSubject<boolean>(false),
    showElectronDensity: new BehaviorSubject<boolean>(false),
    disableElectronDensity: new BehaviorSubject<boolean>(false),
    showBallAndStick: new BehaviorSubject<boolean>(false),
  };

  constructor() {
    const defaultSpec = DefaultPluginUISpec();
    const spec: PluginUISpec = {
      ...defaultSpec,
      layout: {
        initial: {
          isExpanded: this.state.isExpanded.value,
          showControls: this.state.showControls.value,
        },
      },
    };
    this._plugin = new PluginUIContext(spec);

    this._init();
  }

  get plugin() {
    return this._plugin;
  }

  sub() {
    this._subscribe(this.state.showBallAndStick, (showBallAndStick) => {
      this._handleVisualsToggle(showBallAndStick);
    });

    this._subscribe(this.state.showElectronDensity, (showElectronDensity) => {
      this._handleShowDensityToggle(showElectronDensity);
    });

    // sync UI layout controls
    this._subscribe(this._plugin!.layout.events.updated, () => {
      this.state.showControls.next(this._plugin.layout.state.showControls);
      this.state.isExpanded.next(this._plugin.layout.state.isExpanded);
    });
  }

  unsub() {
    this._plugin.unmount();
    for (const sub of this._subscriptions) sub.unsubscribe();
    this._subscriptions = [];
  }

  async load(pdbId: string, selection: RingSelection) {
    if (this.state.isLoading.value) return;

    this.state.isLoading.next(true);

    await this._plugin.clear();
    await this._load(pdbId, selection);
    this.focusRing(selection);

    this.state.isLoading.next(false);
  }

  focusRing(selection: RingSelection) {
    const structureRef = this.plugin.managers.structure.hierarchy.current.structures[0];
    const structure = structureRef.cell.obj?.data;
    if (!structure) return;

    const expression = this._getExpression(selection);
    const query = compile<StructureSelection>(expression);
    const structureSelection = query(new QueryContext(structure));
    const loci = StructureSelection.toLociWithSourceUnits(structureSelection);

    this._plugin.managers.camera.focusLoci(loci);
    // this.plugin.managers.interactivity.lociHighlights.highlightOnly({ loci });
    // this.plugin.managers.interactivity.lociSelects.selectOnly({ loci });
    // this.plugin.managers.structure.focus.setFromLoci(loci);
  }

  private async _init() {
    await this._plugin.init();

    this._plugin.managers.interactivity.setProps({
      granularity: 'element',
    });
    this._plugin.behaviors.layout.leftPanelTabName.next('data');

    this.state.isInitialized.next(true);
  }

  private _subscribe<T>(observable: Observable<T>, sub: (v: T) => void) {
    this._subscriptions.push(observable.subscribe(sub));
  }

  private async _load(pdbId: string, selection: RingSelection) {
    const expression = this._getExpression(selection);
    const ringSelectionQuery = StructureSelectionQuery('Ring', expression);

    // load and create structure
    const data = await this._plugin.builders.data.download({
      url: `https://www.ebi.ac.uk/pdbe/entry-files/download/${pdbId}.bcif`,
      isBinary: true,
    });
    const trajectory = await this._plugin.builders.structure.parseTrajectory(data, 'mmcif');
    const model = await this._plugin.builders.structure.createModel(trajectory);
    const structure = await this._plugin.builders.structure.createStructure(model, {
      name: 'auto',
      params: {},
    });

    if (!model?.cell?.obj?.data) {
      console.error('Missing model');
      return;
    }

    // check if trajectory has more models
    const count = Model.TrajectoryInfo.get(model?.cell?.obj?.data).size;
    this.state.disableElectronDensity.next(count > 1);

    // create components
    const polymer = await this._plugin.builders.structure.tryCreateComponentStatic(
      structure,
      'polymer',
    );
    const ligand = await this._plugin.builders.structure.tryCreateComponentStatic(
      structure,
      'ligand',
    );
    const ring = await this._plugin.builders.structure.tryCreateComponentFromSelection(
      structure,
      ringSelectionQuery,
      'ring-selection',
    );

    // check successful build
    if (!polymer || !ligand || !ring) {
      console.error('Failed to create component');
      return;
    }

    // create visual representations
    const polymerCartoonVisual =
      await this._plugin.builders.structure.representation.addRepresentation(polymer, {
        type: 'cartoon',
        typeParams: {
          alpha: 0.4,
        },
        color: 'element-symbol',
        colorParams: { carbonColor: { name: 'element-symbol', params: {} } },
      });
    const polymerBasVisual = await this._plugin.builders.structure.representation.addRepresentation(
      polymer,
      {
        type: 'ball-and-stick',
        typeParams: {
          alpha: 0.4,
        },
        color: 'element-symbol',
        colorParams: { carbonColor: { name: 'element-symbol', params: {} } },
      },
      { initialState: { isHidden: true } },
    );
    const ligandVisual = await this._plugin.builders.structure.representation.addRepresentation(
      ligand,
      {
        type: 'ball-and-stick',
        color: 'element-symbol',
        colorParams: { carbonColor: { name: 'element-symbol', params: {} } },
      },
    );
    const ringVisual = await this._plugin.builders.structure.representation.addRepresentation(
      ring,
      {
        type: 'ball-and-stick',
        typeParams: {
          sizeFactor: 0.16,
          aromaticSpacing: 0.85,
        },
        color: 'element-symbol',
        colorParams: {
          carbonColor: { name: 'element-symbol', params: {} },
          colors: { name: 'custom', params: { C: Color.fromRgb(78, 78, 78) } },
        },
        size: 'physical',
        sizeParams: {
          scale: 1.1,
        },
      },
    );

    // save node refs
    this._cellRefs = {
      assembly: structure.cell,
      polymer: {
        cartoon: polymerCartoonVisual.cell,
        bas: polymerBasVisual.cell,
      },
      ligand: ligandVisual.cell,
      ring: ringVisual.cell,
    };
  }

  private _getExpression(selection: RingSelection): Expression {
    const { atomIds, chainId, compId, residueId } = selection;

    const expression = MS.struct.generator.atomGroups({
      'atom-test': MS.core.logic.and([
        MS.core.rel.eq([MS.struct.atomProperty.macromolecular.auth_asym_id(), chainId]),
        MS.core.rel.eq([MS.struct.atomProperty.macromolecular.auth_comp_id(), compId]),
        MS.core.rel.eq([MS.struct.atomProperty.macromolecular.auth_seq_id(), residueId]),
        MS.core.logic.or([
          ...atomIds.map((atomId: string) =>
            MS.core.rel.eq([MS.struct.atomProperty.macromolecular.auth_atom_id(), atomId]),
          ),
        ]),
      ]),
    });

    return expression;
  }

  private _handleVisualsToggle(showBallAndStick: boolean) {
    if (!this._cellRefs.polymer?.cartoon || !this._cellRefs.polymer?.bas) return;

    setSubtreeVisibility(
      this._plugin.state.data,
      this._cellRefs.polymer.cartoon.transform.ref,
      showBallAndStick,
    );

    setSubtreeVisibility(
      this._plugin.state.data,
      this._cellRefs.polymer.bas.transform.ref,
      !showBallAndStick,
    );
  }

  private async _handleShowDensityToggle(showElectronDensity: boolean) {
    if (showElectronDensity && !this._cellRefs.volumeStreaming) {
      await this._createDensity();
    }

    if (!this._cellRefs.volumeStreaming) return;

    setSubtreeVisibility(
      this._plugin.state.data,
      this._cellRefs.volumeStreaming,
      !showElectronDensity,
    );
  }

  private async _createDensity() {
    this.state.isLoading.next(true);

    const asm = this._cellRefs.assembly?.obj;
    if (!asm) return;

    const params = InitVolumeStreaming.createDefaultParams(asm, this._plugin);
    params.defaultView = 'auto';
    params.options.behaviorRef = this._volumeStreamingTag;
    params.options.channelParams['fo-fc(+ve)'] = { wireframe: true };
    params.options.channelParams['fo-fc(-ve)'] = { wireframe: true };

    await this._plugin.runTask(
      this._plugin.state.data.applyAction(
        InitVolumeStreaming,
        params,
        this._cellRefs.assembly?.transform.ref,
      ),
    );

    // save node ref
    this._cellRefs.volumeStreaming = this._volumeStreamingTag;

    this.state.isLoading.next(false);
  }
}
