import { PluginUIContext } from 'molstar/lib/commonjs/mol-plugin-ui/context';
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/commonjs/mol-plugin-ui/spec';
import { Color } from 'molstar/lib/commonjs/mol-util/color';
import { RxEventHelper } from 'molstar/lib/mol-util/rx-event-helper';
import { QueryContext, StructureSelection } from 'molstar/lib/commonjs/mol-model/structure';
import { MolScriptBuilder as MS } from 'molstar/lib/mol-script/language/builder';
import { compile } from 'molstar/lib/commonjs/mol-script/runtime/query/base';
import { StructureSelectionQuery } from 'molstar/lib/commonjs/mol-plugin-state/helpers/structure-selection-query';
import { Subscription, Observable } from 'rxjs';
import { StateObjectCell } from 'molstar/lib/commonjs/mol-state';
import { setSubtreeVisibility } from 'molstar/lib/commonjs/mol-plugin/behavior/static/state';
import { InitVolumeStreaming } from 'molstar/lib/commonjs/mol-plugin/behavior/dynamic/volume-streaming/transformers';

interface RingSelection {
  chainId: string;
  compId: string;
  residueId: number;
  atomIds: string[];
}

interface CellRefs {
  assembly?: StateObjectCell;
  polymer?: StateObjectCell;
  ligand?: StateObjectCell;
  ring?: StateObjectCell;
  volumeStreaming?: string;
}

export default class MolstarViewerModel {
  private _plugin: PluginUIContext;
  private _ev = RxEventHelper.create();
  private _subscriptions: Subscription[] = [];
  private _cellRefs: CellRefs = {};

  public state = {
    isInitializing: this._ev.behavior<boolean>(false),
    isLoading: this._ev.behavior<boolean>(false),
    showElectronDensity: this._ev.behavior<boolean>(false),
    showBallAndStick: this._ev.behavior<boolean>(false),
  };

  constructor() {
    const defaultSpec = DefaultPluginUISpec();
    const spec: PluginUISpec = {
      ...defaultSpec,
      layout: {
        initial: {
          isExpanded: true,
          showControls: true,
        },
      },
      canvas3d: {
        renderer: {
          // backgroundColor: Color(0xf1f1f1),
          backgroundColor: Color(0xffffff),
        },
      },
    };
    this._plugin = new PluginUIContext(spec);

    // initialize
    this._init();
  }

  mount(target: HTMLElement) {
    this._plugin.mount(target);
  }

  unmount() {
    this._plugin.unmount();
  }

  sub() {
    this._subscribe(this.state.showBallAndStick, async (showBallAndStick) => {
      if (!this._cellRefs.polymer) return;

      this.state.isLoading.next(true);

      setSubtreeVisibility(
        this._plugin.state.data,
        this._cellRefs.polymer.transform.ref,
        !showBallAndStick,
      );

      // await this._plugin.state.data
      //   .build()
      //   .to(this._visualRef.polymer)
      //   .update((old) => {
      //     if (!old.type) return;
      //     old.type = "ball-and-stick"
      //   })
      //   .commit();

      this.state.isLoading.next(false);
    });
    this._subscribe(this.state.showElectronDensity, async (showElectronDensity) => {
      if (showElectronDensity && !this._cellRefs.volumeStreaming) {
        const asm = this._cellRefs.assembly?.obj;
        if (!asm) return;
        const params = InitVolumeStreaming.createDefaultParams(asm, this._plugin);
        params.defaultView = 'auto';
        params.options.behaviorRef = 'volume-streaming';
        params.options.channelParams['fo-fc(+ve)'] = { wireframe: true };
        params.options.channelParams['fo-fc(-ve)'] = { wireframe: true };
        await this._plugin.runTask(
          this._plugin.state.data.applyAction(
            InitVolumeStreaming,
            params,
            this._cellRefs.assembly?.transform.ref,
          ),
        );
        this._cellRefs.volumeStreaming = 'volume-streaming';
      }

      if (this._cellRefs.volumeStreaming)
        setSubtreeVisibility(
          this._plugin.state.data,
          this._cellRefs.volumeStreaming,
          !showElectronDensity,
        );
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

    console.log('loading');

    await this._plugin.clear();
    await this._load(pdbId, selection);

    this.state.isLoading.next(false);
  }

  private async _load(pdbId: string, selection: RingSelection) {
    const data = await this._plugin.builders.data.download({
      url: `https://www.ebi.ac.uk/pdbe/entry-files/download/${pdbId}.bcif`,
      isBinary: true,
    });
    const trajectory = await this._plugin.builders.structure.parseTrajectory(data, 'mmcif');
    const model = await this._plugin.builders.structure.createModel(trajectory);
    const structure = await this._plugin.builders.structure.createStructure(model, {
      name: 'assembly',
      params: {},
    });

    const polymer = await this._plugin.builders.structure.tryCreateComponentStatic(
      structure,
      'polymer',
    );
    if (!polymer) return;

    const ligand = await this._plugin.builders.structure.tryCreateComponentStatic(
      structure,
      'ligand',
    );
    if (!ligand) return;

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

    const structureSelectionQuery = StructureSelectionQuery('Something', expression);

    const ring = await this._plugin.builders.structure.tryCreateComponentFromSelection(
      structure,
      structureSelectionQuery,
      'ring-selection',
    );
    if (!ring) return;

    const polymerVisual = await this._plugin.builders.structure.representation.addRepresentation(
      polymer,
      {
        type: 'cartoon',
        typeParams: {
          alpha: 0.4,
        },
        color: 'element-symbol',
        colorParams: { carbonColor: { name: 'element-symbol', params: {} } },
      },
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

    this._cellRefs = {
      assembly: structure.cell,
      polymer: polymerVisual.cell,
      ligand: ligandVisual.cell,
      ring: ringVisual.cell,
    };

    const query = compile<StructureSelection>(expression);
    const struct = structure.cell?.obj?.data;
    if (!struct) return;
    const structureSelection = query(new QueryContext(struct));

    const loci = StructureSelection.toLociWithSourceUnits(structureSelection);

    this._plugin.managers.camera.focusLoci(loci);
    // this.plugin.managers.interactivity.lociHighlights.highlightOnly({ loci });
    // this.plugin.managers.interactivity.lociSelects.selectOnly({ loci });
    // this.plugin.managers.structure.focus.setFromLoci(loci);
  }

  private async _init() {
    this.state.isInitializing.next(true);

    await this._plugin.init();

    this._plugin.managers.interactivity.setProps({
      granularity: 'element',
    });

    this.state.isInitializing.next(false);
  }

  private _subscribe<T>(observable: Observable<T>, sub: (v: T) => void) {
    this._subscriptions.push(observable.subscribe(sub));
  }
}
