# ObjectStream

## Properties
### <small>number[]</small> changingIds
### <small>\{ 20: \{ write: (object: any, table: any, hint: any) => any; }; 21: \{ write: (object: any, table: any, hint: any) => any; }; 24: \{ write: (object: any, table: any, hint: any) => any; }; 34: \{ write: (object: any, table: any, hint: any) => \{ width: any; height: any; depth: number; offset: any; bitmap: any; }; }; 124: \{ version: number; read: \{ objName: number; scripts: (fields: any) => any; sounds: (fields: any) => any; costumes: (fields: any) => any; currentCostumeIndex: (fields: any, parent: any) => any; scratchX: (fields: any, parent: any) => number; scratchY: (fields: any, parent: any) => number; scale: (fields: any) => any; direction: (fields: any, parent: any) => any; rotationStyle: number; isDraggable: number; indexInLibrary: (fields: any, parent: any) => any; visible: (fields: any) => boolean; variables: (fields: any) => \{ name: string; value: any; isPersistent: boolean; }[]; lists: number; volume: number; tempoBPM: number; }; write: (number | boolean | ((object: any, table: any) => any))[]; }; 125: \{ version: number; read: \{ objName: number; sounds: (fields: any) => any; costumes: (fields: any) => any; currentCostumeIndex: (fields: any, parent: any) => any; children: number; variables: (fields: any) => \{ name: string; value: any; isPersistent: boolean; }[]; lists: (fields: any) => any[]; scripts: (fields: any) => any; volume: number; tempoBPM: number; }; write: (number | boolean | typeof blocksBinWrite)[]; }; 155: \{ read: \{ objName: (fields: any) => any; displayName: (fields: any) => any; }; write: any[]; }; 162: \{ read: \{ costumeName: number; rotationCenterX: (fields: any) => any; rotationCenterY: (fields: any) => any; image: (fields: any) => any; }; write: ((object: any, table: any) => any)[]; }; 164: \{ read: \{ soundName: number; sampledSound: number; volume: number; balance: number; compressed: (fields: any) => boolean; compressedData: (fields: any) => any; _fields: (fields: any) => any; }; write: any[]; }; 175: \{ read: \{ listName: number; contents: number; isPersistent: boolean; target: (fields: any) => any; x: (fields: any) => any; y: (fields: any) => any; width: (fields: any) => number; height: (fields: any) => number; visible: (fields: any) => boolean; }; write: any[]; }; }</small> formats
### <small>ReadStream | WriteStream</small> stream
### <small>object</small> object

## Methods
### <small>number</small> writeObject(<small>object: any</small>, <small>id: any</small>, <small>hint: any</small>)
### <small>any</small> createObject(<small>table: any</small>, <small>object: any</small>, <small>id: any</small>, <small>hint: any</small>)
### <small>void</small> writeTableObject(<small>object: any</small>)
### <small>void</small> writeUserFormat(<small>object: any</small>)
### <small>void</small> writeFixedFormat(<small>object: any</small>)
### <small>void</small> writeInline(<small>object: any</small>)
### <small>any</small> readObject()
### <small>\{ id: any; version: number; fields: any[]; } | \{ id: number; object: any; }</small> readTableObject()
### <small>\{ id: any; version: number; fields: any[]; }</small> readUserFormat(<small>id: any</small>)
### <small>any</small> readFixedFormat(<small>id: any</small>)
### <small>number | boolean | void | \{ isRef: boolean; index: number | void; }</small> readInline()
### <small>void</small> fixObjectRefs(<small>table: any</small>, <small>object: any</small>)
### <small>void</small> fixFixedFormat(<small>table: any</small>, <small>object: any</small>)
### <small>any</small> deRef(<small>table: any</small>, <small>object: any</small>)
### <small>any</small> buildImage(<small>image: any</small>)
### <small>void</small> decompressBitmapFlip(<small>src: any</small>, <small>out: any</small>)
### <small>Uint8Array</small> decompressBitmap(<small>src: any</small>)
### <small>any</small> jsonify(<small>object: any</small>, <small>parent: any</small>)
