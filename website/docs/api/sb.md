# sb

## Properties
### <small>(compatibilityMode extends true ? CompatibilityProjectInfo | null : Collection\<ProjectInfoKey, any>)</small> info
### <small>(compatibilityMode extends true ? CompatibilityStage | null : Stage)</small> stage
### <small>string | undefined</small> path
### <small>Buffer | undefined</small> buffer
### <small>unknown</small> _compatibility
### <small>unknown</small> read
### <small>unknown</small> read1
### <small>unknown</small> read2
### <small>Buffer</small> buffer
### <small>number</small> index
### <small>Uint8Array</small> uint8array
### <small>number</small> allocated
### <small>number</small> index
### <small>Uint8Array</small> array
### <small>number[]</small> changingIds
### <small>\{ 20: \{ write: (object: any, table: any, hint: any) => any; }; 21: \{ write: (object: any, table: any, hint: any) => any; }; 24: \{ write: (object: any, table: any, hint: any) => any; }; 34: \{ write: (object: any, table: any, hint: any) => \{ width: any; height: any; depth: number; offset: any; bitmap: any; }; }; 124: \{ version: number; read: \{ objName: number; scripts: (fields: any) => any; sounds: (fields: any) => any; costumes: (fields: any) => any; currentCostumeIndex: (fields: any, parent: any) => any; scratchX: (fields: any, parent: any) => number; scratchY: (fields: any, parent: any) => number; scale: (fields: any) => any; direction: (fields: any, parent: any) => any; rotationStyle: number; isDraggable: number; indexInLibrary: (fields: any, parent: any) => any; visible: (fields: any) => boolean; variables: (fields: any) => \{ name: string; value: any; isPersistent: boolean; }[]; lists: number; volume: number; tempoBPM: number; }; write: (number | boolean | ((object: any, table: any) => any))[]; }; 125: \{ version: number; read: \{ objName: number; sounds: (fields: any) => any; costumes: (fields: any) => any; currentCostumeIndex: (fields: any, parent: any) => any; children: number; variables: (fields: any) => \{ name: string; value: any; isPersistent: boolean; }[]; lists: (fields: any) => any[]; scripts: (fields: any) => any; volume: number; tempoBPM: number; }; write: (number | boolean | typeof blocksBinWrite)[]; }; 155: \{ read: \{ objName: (fields: any) => any; displayName: (fields: any) => any; }; write: any[]; }; 162: \{ read: \{ costumeName: number; rotationCenterX: (fields: any) => any; rotationCenterY: (fields: any) => any; image: (fields: any) => any; }; write: ((object: any, table: any) => any)[]; }; 164: \{ read: \{ soundName: number; sampledSound: number; volume: number; balance: number; compressed: (fields: any) => boolean; compressedData: (fields: any) => any; _fields: (fields: any) => any; }; write: any[]; }; 175: \{ read: \{ listName: number; contents: number; isPersistent: boolean; target: (fields: any) => any; x: (fields: any) => any; y: (fields: any) => any; width: (fields: any) => number; height: (fields: any) => number; visible: (fields: any) => boolean; }; write: any[]; }; }</small> formats
### <small>ReadStream | WriteStream</small> stream
### <small>object</small> object


## Methods
### <small>any</small> blocksBinWrite(<small>object: Record</small>, <small>table: any[] | object</small>)
### <small>any</small> buildScript(<small>script: any</small>)
