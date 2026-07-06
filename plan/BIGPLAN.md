# BIGPLAN

## 1. Contexto

Bomify debe evolucionar de una ficha/manual de piezas hacia una herramienta profesional para administrar productos, moldes, materiales, consumo y mapas de corte.

La referencia actual está en `plan/Flock_Fichas_Piezas.html`. Es una aplicación HTML autónoma llamada `Flock · Fichas de piezas`, enfocada en administrar una lista de piezas, su relación con materiales y la generación de stickers imprimibles para taller.

El HTML actual representa:

- una lista editable de piezas
- un número interno por pieza
- la conversión visual de ese número a romano
- un nombre o descripción corta de referencia
- una lista de líneas de material por pieza
- una cantidad por línea de material
- un texto custom por material cuando el material visible no debe ser solamente el nombre base
- una base editable de materiales con `key`, `label` y `color`
- una ficha de materiales por pieza que hoy funciona como una combinación única por defecto
- importación/exportación JSON de piezas
- importación/exportación JSON de materiales
- preview de stickers y salida por `window.print()`
- stickers paginados en hoja carta, 2 columnas por 5 filas

El modelo de datos actual se parece a:

```json
[
  {
    "num": 1,
    "name": "FRENTE",
    "materials": [
      {
        "material": "cuero",
        "qty": 1
      }
    ]
  }
]
```

La base de materiales actual se parece a:

```json
[
  {
    "key": "cuero",
    "label": "Cuero",
    "color": "#8a5a34"
  }
]
```

El siguiente nivel no debe ser solamente una tabla mejorada. Debe convertirse en un sistema de planeación de producción para moldes: importar PDFs, entender piezas, asignarlas a materiales, optimizar cortes, calcular consumo real y exportar archivos útiles para taller.

## 1.1. Qué debe preservarse de `Flock_Fichas_Piezas.html`

El HTML actual ya resuelve una parte importante del flujo de taller: la ficha imprimible de cada pieza. Bomify debe preservar esa lógica y convertirla en un módulo formal.

Funciones existentes que deben migrarse:

- edición inline de piezas
- agregar/eliminar piezas
- agregar/eliminar líneas de material por pieza
- cantidad por material
- material custom visible para casos como `MALLA/LONA/CUERO (a elegir)`
- leyenda de materiales en uso
- base editable de materiales
- color por material
- creación automática de materiales nuevos durante importación
- normalización de claves de material a minúscula
- importar piezas por JSON
- reemplazar lista de piezas por JSON
- agregar piezas importadas al final
- importar materiales por JSON
- reemplazar base de materiales por JSON
- agregar/actualizar materiales importados
- exportar piezas a JSON
- exportar materiales a JSON
- imprimir/guardar PDF desde preview
- texto de marca configurable junto al logo
- fecha generada en locale `es-CO`

Restricciones visuales actuales a considerar:

- el header dice `Generador de stickers 8x5cm`
- el CSS actual usa stickers de `78mm x 46mm`
- la hoja es carta: `215.9mm x 279.4mm`
- se imprimen 10 stickers por hoja: 2 columnas x 5 filas
- el preview usa etiqueta de hoja con marca y número de página
- los colores de material se muestran como puntos/chips

Materiales iniciales encontrados:

- `cuero`
- `forro`
- `lona`
- `yumbolon`
- `cambre`
- `seda`
- `malla`
- `eva`
- `refuerzo`
- `otro`

Piezas iniciales encontradas:

- `1` `FRENTE`
- `2` `BOLSILLO LATERAL`
- `3` `BOLSILLO FRONTAL INFERIOR`
- `4` `CENTRO CREMALLERA ESPALDAR`
- `5` `CREMALLERO LATERAL ESPALDAR`
- `6` `A Y B / LADO LATERAL FRENTE`
- `7` `BOLSILLO FRENTE "C.K"`
- `8` `FALSO`
- `9` `CREMALLERO FRENTE`
- `10` `FALSO CK`
- `11` `PORTACIERRE PORTATIL`
- `12` `ESPALDAR`
- `13` `FORRO INTERIOR FRENTE`
- `14` `-- (1x1 doble)`
- `15` `BOLSILLO INTERIOR FRENTE`
- `16` `BOLSILLO FRENTE`
- `17` `BOLSILLO DIVISION`
- `18` `PORTACIERRE BOCA EXPLORER`
- `19` `REFUERZO FRENTE`
- `20` `--`
- `21` `CORREAS`
- `22` `--`
- `23` `DIVISION`
- `24` `DIVISION`
- `26` `--`

## 2. Visión del producto

Bomify será una aplicación para diseñar y preparar órdenes de corte de productos textiles o similares, especialmente bolsos y piezas con moldes físicos/digitales.

El usuario debe poder:

- crear un producto con nombre, referencia y foto
- subir uno o varios moldes en PDF
- detectar o registrar las piezas dentro del molde
- inferir o corregir medidas de cada pieza
- asignar piezas a uno o varios materiales
- indicar cuántas copias de cada pieza se cortan por producto
- crear combinaciones del mismo producto donde cambian materiales, colores y asignaciones por pieza
- mantener ciertas piezas/materiales iguales en todas las combinaciones, por ejemplo yumbolones o refuerzos
- definir materiales por nombre, color, ancho del rollo y parámetros de corte
- generar un mapa de corte optimizado por material
- calcular cuántos metros o centímetros lineales se consumen por material
- exportar vista previa en PDF y DXF
- exportar uno o varios moldes individuales
- imprimir stickers para pegar a moldes físicos
- visualizar el mapa con hover, cantidades, pieza, material y producto
- probar combinaciones de materiales/colores antes de generar el corte final

## 3. Principios clave

- Las dimensiones deben manejarse en una unidad interna estable, preferiblemente milímetros.
- La importación automática debe ser corregible manualmente; ningún extractor de PDF será perfecto.
- El cálculo de consumo debe ser trazable: cada resultado debe explicar qué piezas, cantidades y materiales generaron ese consumo.
- El mapa de corte debe funcionar primero con una aproximación simple y luego evolucionar hacia nesting real de polígonos.
- Los exports deben ser reproducibles: si se genera un PDF/DXF hoy, el mismo plan debe poder regenerarse mañana con los mismos parámetros.
- Las piezas deben tener identidad propia dentro del producto, no depender únicamente del archivo PDF original.

## 4. Modelo de dominio propuesto

### Product

Representa el artículo final que se fabrica.

Campos principales:

- `id`
- `name`
- `reference`
- `description`
- `imageUrl`
- `createdAt`
- `updatedAt`

Relaciones:

- tiene muchas `PatternFile`
- tiene muchas `Piece`
- tiene muchas `ProductCombination`
- tiene muchas `CutPlan`

### PatternFile

Representa un archivo de molde importado, normalmente PDF.

Campos principales:

- `id`
- `productId`
- `fileName`
- `fileUrl`
- `mimeType`
- `pageCount`
- `unit`
- `scaleStatus`
- `calibrationData`
- `createdAt`

Propósito:

- guardar el archivo original
- registrar cómo fue interpretado
- permitir reprocesar o revisar la extracción

### Piece

Representa una pieza del producto, independiente de cuántas veces se corte.

Campos principales:

- `id`
- `productId`
- `patternFileId`
- `number`
- `name`
- `description`
- `widthMm`
- `heightMm`
- `areaMm2`
- `perimeterMm`
- `geometryStatus`
- `defaultRotationAllowed`
- `defaultMirrorAllowed`
- `createdAt`
- `updatedAt`

Notas:

- `number` es el número interno dentro del producto, por ejemplo `I`, `II`, `XIII` o `1`, `2`, `13`.
- `widthMm` y `heightMm` pueden inferirse desde el molde, pero deben poder corregirse.
- `areaMm2` será clave para estimaciones rápidas, aunque el consumo final depende del nesting.

### PieceGeometry

Representa la geometría base de la pieza.

La geometría no debe modelar marcas internas, puntos, huecos, textos, líneas punteadas, piquetes ni instrucciones de costura como entidades separadas. El PDF puede traer elementos visuales internos, como se ve en los moldes de referencia, pero Bomify no los administra de forma semántica. Para esta etapa solo importa tener una geometría base que permita visualizar, medir, acomodar y exportar la pieza.

Campos principales:

- `id`
- `pieceId`
- `sourcePage`
- `sourceGeometry`
- `normalizedGeometry`
- `bounds`
- `widthMm`
- `heightMm`
- `areaMm2`
- `confidence`

Propósito:

- separar la ficha administrativa de la geometría técnica
- permitir exportar piezas individuales
- permitir nesting irregular en fases futuras
- mantener una representación simple: contorno/base de la pieza y sus límites
- evitar clasificar elementos internos del molde como datos de negocio

### Material

Representa un tipo de material base.

Campos principales:

- `id`
- `name`
- `description`
- `defaultRollWidthMm`
- `cuttingMethod`
- `kerfMm`
- `defaultSpacingMm`
- `createdAt`
- `updatedAt`

Ejemplos:

- `Canvas`
- `Lining`
- `Leather`
- `Foam`
- `Interfacing`

### MaterialVariant

Representa una variante concreta del material, especialmente color o acabado.

Campos principales:

- `id`
- `materialId`
- `name`
- `colorName`
- `hexColor`
- `supplierReference`
- `rollWidthMm`
- `isActive`

Ejemplo:

- Material: `Canvas`
- Variant: `Canvas Black`, `#111111`, roll width `1400 mm`

### ProductCombination

Representa una combinación fabricable del mismo producto.

Una combinación es el holder principal de qué material, variante o color usa cada pieza. El molde y las piezas base pueden ser los mismos, pero la combinación decide qué piezas van en lona negra, forro rojo, cuero, malla, etc.

Campos principales:

- `id`
- `productId`
- `name`
- `referenceSuffix`
- `imageUrl`
- `description`
- `isDefault`
- `createdAt`
- `updatedAt`

Ejemplos:

- `Black canvas / red lining`
- `Full leather`
- `Canvas with mesh back`
- `Explorer standard`

Notas:

- un producto debe tener al menos una combinación por defecto
- el JSON actual de `Flock_Fichas_Piezas.html` debe importarse como esa combinación por defecto
- una combinación puede heredar asignaciones compartidas del producto y definir overrides propios
- los cut plans se calculan siempre para una combinación concreta

### PieceMaterialAssignment

Define qué pieza se corta en qué material y cuántas copias requiere por producto dentro de una combinación.

Campos principales:

- `id`
- `productId`
- `combinationId`
- `pieceId`
- `materialId`
- `materialVariantId`
- `quantityPerProduct`
- `customLabel`
- `assignmentScope`
- `lockedAcrossCombinations`
- `rotationAllowed`
- `mirrorAllowed`
- `grainDirectionRequired`
- `notes`

Notas:

- una pieza puede cortarse en más de un material
- la cantidad puede variar por material
- algunas piezas deben respetar dirección de hilo, textura o estampado
- `customLabel` preserva casos del HTML actual donde la etiqueta impresa no es solo el material, por ejemplo `MALLA/LONA/CUERO (a elegir)` o `FORRO 1x1 doble`
- `assignmentScope` puede ser `combination` o `shared`
- `combination` significa que la asignación vive solo dentro de una combinación
- `shared` significa que la asignación aplica a todas las combinaciones del producto
- `lockedAcrossCombinations` permite marcar piezas/materiales que no deben cambiar entre combinaciones, por ejemplo yumbolones, refuerzos o piezas internas estándar
- si una asignación compartida cambia, todas las combinaciones deben reflejar el cambio

### CutPlan

Representa una simulación o plan real de corte para un producto y una cantidad.

Campos principales:

- `id`
- `productId`
- `combinationId`
- `name`
- `productQuantity`
- `status`
- `strategy`
- `createdAt`
- `updatedAt`

Ejemplo:

- producto: `Tote Bag`
- cantidad: `10`
- estrategia: `best_fit_by_material`

### CutPlanMaterial

Agrupa el resultado del plan por material.

Campos principales:

- `id`
- `cutPlanId`
- `materialId`
- `materialVariantId`
- `rollWidthMm`
- `requiredLengthMm`
- `usedAreaMm2`
- `wasteAreaMm2`
- `efficiency`

Propósito:

- responder preguntas como: "Para 10 bolsos, cuántos metros de lona negra necesito?"

### CutPlacement

Representa una pieza colocada en un mapa de corte.

Campos principales:

- `id`
- `cutPlanMaterialId`
- `pieceId`
- `copyIndex`
- `xMm`
- `yMm`
- `rotationDeg`
- `mirrored`
- `bounds`
- `geometrySnapshot`

Propósito:

- renderizar el mapa
- exportar PDF/DXF
- permitir hover y selección
- auditar el cálculo

### ExportJob

Representa una exportación generada o pendiente.

Campos principales:

- `id`
- `cutPlanId`
- `type`
- `status`
- `fileUrl`
- `options`
- `createdAt`

Tipos:

- `cut_map_pdf`
- `cut_map_dxf`
- `single_piece_pdf`
- `selected_pieces_pdf`
- `stickers_pdf`

### StickerTemplate

Define cómo se imprimen etiquetas para moldes físicos.

Campos principales:

- `id`
- `name`
- `pageSize`
- `labelWidthMm`
- `labelHeightMm`
- `columns`
- `rows`
- `paddingMm`
- `fields`

Campos imprimibles:

- producto
- referencia
- pieza
- número de pieza
- material
- cantidad por producto
- código QR o barcode

Template inicial a migrar desde `Flock_Fichas_Piezas.html`:

- papel carta: `215.9mm x 279.4mm`
- sticker: `78mm x 46mm`
- grid: `2` columnas x `5` filas
- capacidad: `10` stickers por hoja
- impresión sin márgenes de navegador mediante `@page size: letter; margin: 0`
- marca configurable en mayúscula
- número visible como `PIEZA01`, `PIEZA02`, etc.
- número romano visible como dato secundario
- lista de materiales con punto de color y cantidad `UND.`

## 5. Borrador conceptual de Prisma

Este bloque no es el schema final, sino una guía para discutir entidades y relaciones.

```prisma
model Product {
  id          String        @id @default(cuid())
  name        String
  reference   String        @unique
  description String?
  imageUrl    String?
  pieces      Piece[]
  combinations ProductCombination[]
  assignments PieceMaterialAssignment[]
  patternFiles PatternFile[]
  cutPlans    CutPlan[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Piece {
  id          String      @id @default(cuid())
  productId   String
  product     Product     @relation(fields: [productId], references: [id])
  number      String
  name        String
  description String?
  widthMm     Int?
  heightMm    Int?
  areaMm2     Int?
  perimeterMm Int?
  geometry    PieceGeometry?
  assignments PieceMaterialAssignment[]
  placements  CutPlacement[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@unique([productId, number])
}

model ProductCombination {
  id              String                    @id @default(cuid())
  productId       String
  product         Product                   @relation(fields: [productId], references: [id])
  name            String
  referenceSuffix String?
  imageUrl        String?
  description     String?
  isDefault       Boolean                   @default(false)
  assignments     PieceMaterialAssignment[]
  cutPlans        CutPlan[]
  createdAt       DateTime                  @default(now())
  updatedAt       DateTime                  @updatedAt

  @@unique([productId, name])
}

model PieceMaterialAssignment {
  id                       String              @id @default(cuid())
  productId                String
  product                  Product             @relation(fields: [productId], references: [id])
  combinationId            String?
  combination              ProductCombination? @relation(fields: [combinationId], references: [id])
  pieceId                  String
  piece                    Piece               @relation(fields: [pieceId], references: [id])
  materialId               String
  material                 Material            @relation(fields: [materialId], references: [id])
  materialVariantId        String?
  materialVariant          MaterialVariant?    @relation(fields: [materialVariantId], references: [id])
  quantityPerProduct       Int
  customLabel              String?
  assignmentScope          String
  lockedAcrossCombinations Boolean             @default(false)
  rotationAllowed          Boolean             @default(true)
  mirrorAllowed            Boolean             @default(false)
  grainDirectionRequired   Boolean             @default(false)
  notes                    String?
}

model Material {
  id                 String            @id @default(cuid())
  name               String            @unique
  description        String?
  defaultRollWidthMm Int
  cuttingMethod      String
  kerfMm             Int               @default(0)
  defaultSpacingMm   Int               @default(0)
  variants           MaterialVariant[]
  assignments        PieceMaterialAssignment[]
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt
}

model MaterialVariant {
  id              String                    @id @default(cuid())
  materialId      String
  material        Material                  @relation(fields: [materialId], references: [id])
  name            String
  colorName       String?
  hexColor        String
  supplierReference String?
  rollWidthMm     Int?
  isActive        Boolean                   @default(true)
  assignments     PieceMaterialAssignment[]
}
```

## 6. Flujo principal esperado

### 6.0 Migrar datos desde el HTML actual

Bomify debe poder importar los JSON que ya produce `Flock_Fichas_Piezas.html`.

Contrato de piezas actual:

```json
[
  {
    "num": 12,
    "name": "ESPALDAR",
    "materials": [
      {
        "material": "forro",
        "qty": 3
      },
      {
        "material": "otro",
        "qty": 1,
        "custom": "MALLA/LONA/CUERO (a elegir)"
      }
    ]
  }
]
```

Reglas de migración:

- `num` se convierte en `Piece.number`
- `name` se convierte en `Piece.name`
- el import crea o usa una `ProductCombination` por defecto
- cada entrada de `materials` se convierte en `PieceMaterialAssignment` dentro de esa combinación
- `material` debe normalizarse como clave estable
- `qty` se convierte en `quantityPerProduct`
- `custom` se convierte en `customLabel`
- si el material no existe, se debe crear como material pendiente de revisión
- después de importar, el usuario puede marcar asignaciones como compartidas o bloqueadas entre combinaciones

Contrato de materiales actual:

```json
[
  {
    "key": "lona",
    "label": "Lona",
    "color": "#6f7d4a"
  }
]
```

Reglas de migración:

- `key` se conserva como slug o clave normalizada
- `label` se convierte en nombre visible
- `color` se convierte en color por defecto o primera variante
- materiales sin ancho de rollo deben quedar pendientes hasta que el usuario defina `defaultRollWidthMm`

### 6.1 Crear producto

El usuario crea un producto con:

- nombre
- referencia
- foto
- descripción opcional

Luego entra al detalle del producto, donde verá:

- resumen de piezas
- archivos de molde
- combinaciones
- asignaciones de material
- planes de corte
- exports generados

### 6.2 Importar molde PDF

El usuario sube un PDF con moldes.

El sistema debe:

- guardar el archivo original
- renderizar preview por página
- extraer paths vectoriales si el PDF los contiene
- detectar contornos cerrados
- detectar textos o numeración visible dentro de cada pieza
- calcular bounding boxes
- estimar ancho, alto, área y perímetro
- guardar una geometría base simple para cada pieza
- presentar una pantalla de revisión manual

### 6.3 Calibrar escala

Como muchos PDFs pueden venir sin escala confiable, el sistema debe permitir calibrar.

Opciones:

- detectar tamaño de página si el PDF tiene unidades correctas
- permitir al usuario medir una línea conocida
- pedir una medida real, por ejemplo "esta línea mide 100 mm"
- aplicar factor de escala a todas las piezas del archivo

Resultado:

- el molde queda con estado `calibrated`
- cada pieza queda con medidas confiables o pendientes de revisión

### 6.4 Revisar piezas detectadas

El usuario debe poder:

- unir o separar contornos detectados
- renombrar pieza
- cambiar número de pieza
- corregir ancho y alto
- marcar pieza como descartada
- definir si puede rotarse
- definir si puede espejarse
- marcar dirección obligatoria de material
- confirmar o corregir la geometría base y sus medidas

### 6.5 Crear combinaciones y asignar materiales

La pantalla de asignación debe partir de una combinación.

Un producto puede tener varias combinaciones que comparten las mismas piezas base, pero cambian los materiales, variantes o colores asignados a ciertas piezas.

Ejemplo:

- combinación `Canvas black / red lining`
- combinación `Canvas green / black lining`
- combinación `Leather premium`

Cada combinación debe poder:

- definir qué piezas se cortan en qué materiales
- definir variantes/color por material
- definir cuántas unidades se cortan por producto
- heredar asignaciones compartidas del producto
- bloquear piezas que no cambian entre combinaciones
- sobrescribir solo las piezas variables

La pantalla de asignación puede funcionar como una matriz:

- filas: piezas
- columnas: materiales o variantes de la combinación activa
- celdas: cantidad por producto

Ejemplo:

| Piece | Canvas Black | Lining Red | Reinforcement |
| --- | ---: | ---: | ---: |
| I - Front panel | 2 | 0 | 0 |
| II - Lining panel | 0 | 2 | 0 |
| XIX - Front reinforcement | 0 | 0 | 1 locked |

Cada celda puede abrir opciones avanzadas:

- rotación permitida
- espejo permitido
- dirección requerida
- margen adicional
- compartida entre combinaciones
- bloqueada para no cambiar entre combinaciones
- notas de corte

Regla importante:

- las combinaciones son los holders de asignaciones material-pieza
- piezas como yumbolones, refuerzos o componentes internos pueden quedar como asignaciones compartidas o locked
- una combinación nueva debe poder duplicarse desde otra para cambiar solo lo variable

### 6.6 Generar mapa de corte

El usuario indica:

- producto
- combinación
- cantidad de productos a producir
- materiales/colores elegidos
- ancho disponible por material
- largo máximo o modo rollo continuo
- separación entre piezas
- kerf del láser/cuchilla

El sistema genera:

- un mapa por material
- largo requerido por material
- eficiencia de uso
- desperdicio
- listado de piezas incluidas
- advertencias si algo no cabe

### 6.7 Visualizar mapa

El mapa debe mostrar:

- lienzo proporcional al material
- piezas coloreadas según material o estado
- número y nombre de pieza
- cantidad por producto
- cantidad total en el plan
- hover con metadata
- selección de pieza
- zoom y pan
- regla o medidas
- resumen de consumo

Hover esperado:

- Product
- Combination
- Piece number
- Piece name
- Material
- Quantity per product
- Total quantity in cut plan
- Width x height
- Rotation

### 6.8 Exportar

Exports mínimos:

- PDF del mapa de corte por material
- DXF del mapa de corte por material
- PDF de una pieza individual
- PDF de piezas seleccionadas
- PDF de stickers

Exports futuros:

- SVG del mapa
- CSV de consumo por material
- reporte completo de producción

## 7. Motor de PDF y geometría

### Fase inicial

Para llegar rápido a un MVP estable:

- importar PDF
- mostrar preview
- permitir registrar piezas manualmente
- permitir dibujar o confirmar bounding boxes
- calcular nesting con rectángulos
- exportar PDF de mapa rectangular

Esto no resuelve perfectamente piezas curvas, pero permite validar el flujo de negocio.

### Fase profesional

Luego se debe incorporar geometría real:

- extracción de vectores desde PDF
- normalización de la geometría base a SVG/path o formato equivalente
- detección de contornos cerrados
- cálculo real de área
- nesting con polígonos
- export DXF con geometría real

### Consideraciones técnicas

Herramientas candidatas:

- `pdfjs-dist` para render y lectura básica de PDF
- motor server-side para convertir PDF a SVG/DXF si hace falta
- librería de geometría para paths, bounding boxes, offset y simplificación
- motor de nesting 2D para polígonos irregulares

Decisión importante:

- En MVP, usar nesting rectangular controlado.
- En versión avanzada, usar polygon nesting para reducir desperdicio real.

## 8. Algoritmo de nesting

### MVP: rectangular packing

Entrada:

- piezas con `widthMm`, `heightMm`
- cantidad total
- ancho del material
- spacing
- rotación permitida

Salida:

- posiciones `x`, `y`
- rotación
- largo requerido
- eficiencia aproximada

Ventajas:

- rápido de implementar
- fácil de validar visualmente
- suficiente para estimación inicial

Limitaciones:

- desperdicia material cuando las piezas tienen curvas o formas irregulares
- no aprovecha bien espacios entre contornos irregulares
- no representa corte profesional final para láser

### Versión avanzada: polygon nesting

Entrada:

- geometría real de cada pieza
- cantidad total
- ancho de rollo
- spacing
- kerf
- reglas de rotación/espejo
- dirección de material

Salida:

- placements con geometría real
- consumo lineal real
- DXF/PDF profesional

Debe considerar:

- rotaciones permitidas
- materiales con dirección
- piezas que no pueden espejarse
- margen entre piezas
- margen de borde del material
- geometría base de cada pieza

## 9. Materiales y consumo

El material debe modelarse como rollo.

Ejemplo:

- `Canvas Black`
- ancho: `1400 mm`
- unidad de compra: metro lineal
- color: `#111111`

Para calcular consumo:

1. seleccionar producto y combinación
2. resolver asignaciones compartidas + asignaciones propias de la combinación
3. agrupar piezas por material/variante
4. multiplicar `quantityPerProduct` por cantidad de productos
5. generar nesting dentro del ancho del rollo
6. calcular el `requiredLengthMm`
7. convertir a metros
8. reportar desperdicio y eficiencia

Ejemplo de resultado:

| Material | Width | Required length | Efficiency |
| --- | ---: | ---: | ---: |
| Canvas Black | 140 cm | 2.35 m | 78% |
| Lining Red | 140 cm | 1.80 m | 72% |

## 10. Experiencia de usuario

### Product list

Vista sobria de productos:

- nombre
- referencia
- foto
- cantidad de piezas
- último plan de corte

### Product detail

Debe ser el centro del flujo:

- header del producto
- tabs: `Pieces`, `Combinations`, `Materials`, `Patterns`, `Cut Plans`, `Exports`

### Pattern import wizard

Pasos:

1. Upload
2. Preview
3. Scale calibration
4. Piece detection
5. Manual review
6. Save pieces

### Piece map editor

Debe permitir:

- ver todas las piezas del molde
- seleccionar una pieza
- editar datos administrativos
- editar medidas
- confirmar geometría
- ver en qué combinaciones se usa

### Material assignment view

Debe ser eficiente para producción:

- tabla/matriz
- edición inline
- selector de combinación activa
- filtros por material
- resumen de piezas sin material
- resumen de piezas locked/shared
- validaciones visibles

### Cut plan workspace

Debe permitir:

- seleccionar combinación del producto
- seleccionar cantidad de productos
- elegir variantes de materiales
- correr optimización
- comparar combinaciones
- duplicar escenarios
- bloquear una pieza en posición en fases futuras
- exportar cuando el resultado sea aceptado

### Sticker printing

Debe permitir:

- escoger producto
- escoger piezas
- escoger material o todos los materiales
- escoger template de etiqueta
- generar PDF imprimible

## 11. Estructura técnica en el repo

Respetando `AGENTS.md`, la estructura debería crecer así:

```text
src/
  app/
    page.tsx
    products/
      page.tsx
      [productId]/
        page.tsx
  views/
    ProductsView/
    ProductDetailView/
    ProductCombinationsView/
    PatternImportView/
    CutPlanView/
    MaterialLibraryView/
  components/
    PieceMap/
    CutCanvas/
    MaterialSwatch/
    StickerPreview/
  core/
    config/
    services/
      product.service.ts
      combination.service.ts
      material.service.ts
      pattern.service.ts
      cut-plan.service.ts
      export.service.ts
    types/
      product.types.ts
      combination.types.ts
      material.types.ts
      pattern.types.ts
      cut-plan.types.ts
    utils/
      geometry.utils.ts
      nesting.utils.ts
      units.utils.ts
      product.utils.ts
```

## 12. Servicios principales

### product.service.ts

Responsabilidades:

- CRUD de productos
- detalle completo del producto
- validaciones de referencia única

### combination.service.ts

Responsabilidades:

- CRUD de combinaciones de producto
- duplicar combinaciones existentes
- resolver asignaciones compartidas y específicas
- mantener sincronizadas las asignaciones bloqueadas entre combinaciones

### pattern.service.ts

Responsabilidades:

- guardar archivos de molde
- procesar PDF
- extraer páginas
- crear piezas sugeridas
- guardar calibración

### material.service.ts

Responsabilidades:

- CRUD de materiales
- CRUD de variantes
- validaciones de ancho y color

### cut-plan.service.ts

Responsabilidades:

- construir input del nesting
- ejecutar optimización
- guardar placements
- calcular consumo
- comparar escenarios

### export.service.ts

Responsabilidades:

- generar PDF
- generar DXF
- generar stickers
- guardar historial de exportaciones

## 13. Internacionalización

Todo texto visible debe ir en `messages/en.json`.

Aunque la conversación del producto sea en español, el código y las keys deben estar en inglés.

Ejemplos de namespaces:

- `products`
- `pieces`
- `materials`
- `patterns`
- `cutPlans`
- `exports`
- `stickers`
- `common`

## 14. Roadmap por fases

### Phase 0: Foundation

Objetivo:

- tener base de Next, Prisma, Jest, lint y CI lista

Estado:

- completado en el setup inicial del repo

### Phase 1: Manual product and material database

Objetivo:

- crear productos
- crear combinaciones por producto
- crear materiales y variantes
- crear piezas manualmente
- asignar materiales a piezas dentro de combinaciones
- marcar asignaciones compartidas o locked entre combinaciones

Entregables:

- CRUD de productos
- CRUD de combinaciones
- CRUD de materiales
- CRUD de piezas
- matriz de asignación material/pieza por combinación
- duplicación de combinación
- tests de servicios y vistas

### Phase 2: Basic cut planning

Objetivo:

- generar mapas de corte usando rectángulos
- calcular consumo por material
- visualizar placements en canvas/SVG

Entregables:

- `CutPlan`
- `CutPlanMaterial`
- `CutPlacement`
- algoritmo rectangular
- vista interactiva con hover
- resumen de consumo

### Phase 3: PDF import MVP

Objetivo:

- subir PDF
- renderizar preview
- calibrar escala
- registrar piezas desde bounding boxes

Entregables:

- wizard de importación
- preview por página
- herramienta de calibración
- herramienta manual para seleccionar piezas
- persistencia de `PatternFile` y `PieceGeometry`

### Phase 4: Export system

Objetivo:

- exportar mapa de corte
- exportar piezas
- exportar stickers

Entregables:

- PDF de mapa por material
- PDF de pieza individual
- PDF de piezas seleccionadas
- sticker template básico
- historial de exports

### Phase 5: Professional geometry

Objetivo:

- usar geometría real del PDF
- mejorar nesting con polígonos
- exportar DXF técnico

Entregables:

- extracción vectorial
- limpieza de paths
- normalización de geometría base
- polygon nesting
- DXF por material
- DXF por pieza

### Phase 6: Scenario comparison

Objetivo:

- cambiar combinaciones de materiales y colores
- comparar consumo entre escenarios

Entregables:

- duplicar cut plan
- cambiar variantes
- comparar consumo
- guardar plan aprobado

## 15. Criterios de aceptación MVP

El MVP debe permitir:

- crear un producto
- crear al menos una combinación del producto
- crear al menos un material con ancho de rollo
- crear piezas con número, nombre, ancho y alto
- asignar cantidad por producto y material dentro de una combinación
- marcar piezas/materiales como compartidos entre combinaciones
- indicar cantidad de productos a fabricar
- generar un mapa de corte rectangular por material para una combinación
- calcular metros requeridos
- ver piezas en mapa con hover
- exportar PDF del mapa
- imprimir stickers básicos

## 16. Riesgos y preguntas abiertas

### Riesgos

- PDFs sin información vectorial clara pueden requerir trazado manual.
- La escala de los moldes puede venir mal o no estar embebida.
- Nesting irregular profesional puede ser complejo y costoso de optimizar.
- DXF requiere precisión técnica: capas, unidades, curvas y compatibilidad con software de corte.
- Materiales con dirección o estampado reducen opciones de rotación y aumentan consumo.

### Preguntas abiertas

- Los PDFs originales vienen como vectores reales o como imágenes escaneadas?
- Las medidas deben manejarse en milímetros, centímetros o pulgadas en UI?
- Las piezas tienen margen de costura incluido o debe agregarse desde Bomify?
- Los cortes láser requieren kerf configurable por material?
- Los stickers necesitan formato específico de impresora o papel?
- El DXF debe exportar solo la geometría base o también texto visual de identificación de pieza?
- Se manejarán inventarios reales de material o solo estimación de consumo?

## 17. Próxima decisión recomendada

La mejor primera versión funcional debería evitar empezar por el problema más difícil del PDF/nesting irregular.

Orden recomendado:

1. Modelar productos, piezas, materiales y asignaciones.
2. Implementar nesting rectangular y consumo por rollo.
3. Crear visualización interactiva del mapa.
4. Exportar PDF simple.
5. Añadir importación de PDF con revisión manual.
6. Evolucionar a geometría real y DXF.

Esto permite validar rápido la lógica del negocio y la experiencia de taller antes de invertir en extracción geométrica avanzada.
