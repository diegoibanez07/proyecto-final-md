# Casos de prueba base

Todos los casos usan una sola matriz relacional `MR`. La relacion `R` se obtiene automaticamente de las posiciones con valor 1.

## Caso 1: Identidad 3 x 3

```text
1 0 0
0 1 0
0 0 1
```

Resultado esperado: reflexiva, simetrica, antisimetrica, transitiva, equivalencia y orden parcial. No es irreflexiva, asimetrica, orden total ni orden estricto.

## Caso 2: Orden total

```text
1 1 1
0 1 1
0 0 1
```

Resultado esperado: reflexiva, antisimetrica, transitiva, orden parcial y orden total.

## Caso 3: Orden estricto

```text
0 1 1
0 0 1
0 0 0
```

Resultado esperado: irreflexiva, asimetrica, antisimetrica, transitiva y orden estricto.

## Caso 4: No transitiva

```text
0 1 0
0 0 1
0 0 0
```

Resultado esperado: falla transitividad porque existen `(1,2)` y `(2,3)`, pero falta `(1,3)`.

## Caso 5: Matriz no cuadrada

```text
1 0
1
```

Resultado esperado: rechazo con mensaje de matriz cuadrada.
