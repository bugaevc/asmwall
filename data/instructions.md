Addition and Subtraction
========================

### `add a, b`
`a += b`

`a` and `b` can't both be memory.

### `sub a, b`
`a -= b`

`a` and `b` can't both be memory.

### `inc a`
`a++`
This command does not raise `CF` flag

### `dec a`
`a--`
This command does not raise `CF` flag

Multiplication and Division
===========================

### `mul a`/`imul a`
The location of a result depends on the type of `a`:

Multiplier type | Operation performed
--------------- | -------------
Byte | `al = al * a`
Word | `(dx, ax) = ax * a`
Dword | `(edx, eax) = eax * a`


`imul` multiplies signed numbers and can have more than one operand

### `imul a, b`
`a *= b`
`a` and `b` have to be of same type

### `imul a, b, c`
`a = b * c`
`c` has to be a constant
`a` and `b` have to be of same type

### `div a`/`idiv a`
The location of a result depends on the type of `a`:

Divider type | Operation performed
------------ | -------------
Byte | `al = ax / a`
Word | `(dx, ax) = ax * a`
Dword | `(edx, eax) = eax * a`
