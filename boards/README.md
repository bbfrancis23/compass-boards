# boards/

Board configs, one file per board: `boards/<name>.board.ts`.

Each file exports a `BoardConfig` (id, domain, label, widget instances, and an advice-prompt builder). Board routing loads configs from this folder by id.
