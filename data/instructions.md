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

### `mul a`

Multiplier type | Operation performed
--------------- | -------------
`byte` | `al = al * a`
`word` | `(dx, ax) = ax * a`
`dword` | `(edx, eax) = eax * a`

`mul` multiplies unsigned numbers

### `imul a`

Multiplier type | Operation performed
--------------- | -------------
`byte` | `al = al * a`
`word` | `(dx, ax) = ax * a`
`dword` | `(edx, eax) = eax * a`

`imul` multiplies signed numbers and can have more than one operand

### `imul a, b`
`a *= b`

`a` and `b` have to be of same type

`imul` multiplies signed numbers

### `imul a, b, c`
`a = b * c`

`c` has to be a constant

`a` and `b` have to be of same type

`imul` multiplies signed numbers

### `div a`

Divider type | Operation performed
------------ | -------------
`byte` | `al = ax / a` <br> `ah = ax % a`
`word` | `ax = (dx, ax) / a` <br> `dx = (dx, ax) % a`
`dword` | `eax = (edx, eax) / a` <br> `edx = (edx, eax) % a`

`div` operates with unsigned numbers

Warning: before performing division with `word` or `byte` types be sure to convert registers (`ax` or `eax`) to apropriate types
