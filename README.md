## RingPDB
<div align="center">
  <br>
  <br>
  <a href="https://github.com/sb-ncbr/ring_pdb">
    <img src="frontend/assets/Logo.svg" alt="RingPDB" width="220">
  </a>
  <br>
  <br>
</div>

RingPDB is an interactive web application for exploring ring conformations in experimentally determined protein structures. It allows users to search, filter, and visualise rings and their conformations in non-standard residues deposited in the Protein Data Bank (PDB).

Website: https://ringpdb.biodata.ceitec.cz


## Related publication
RingPDB builds on a previous workflow for the conformational analysis of rings in ligands:

`Analysis of cyclohexane, cyclopentane, and benzene conformations in ligands for PDB X-ray structures using the Hill-Reilly approach` by Bučeková G, Doshchenko V, Svoboda T, Porubská J, Chareshneu A, Raček T, et al. Journal of Cheminformatics (2026).

DOI: [10.1186/s13321-026-01154-0](https://doi.org/10.1186/s13321-026-01154-0)

## How to run

### Dataset management with [Git LFS](https://git-lfs.com/)

Large dataset files are managed using Git Large File Storage (Git LFS). Make sure Git LFS is installed and initialized before cloning or updating the repository.

### Development

```bash
docker compose -f ./docker/docker-compose.yml up --build --watch
```

### Production on local machine
```bash
echo "VITE_API_URL=/api" > frontend/.env.production.local
docker compose -f ./docker/docker-compose-production-local.yml up --build
```

### Production 
```bash
docker compose -f ./docker/docker-compose-production-local.yml -f ./docker/docker-compose.production.yml up -d --build

```
