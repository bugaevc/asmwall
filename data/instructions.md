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

This command does not raise `CF` flag.

### `dec a`

`a--`

This command does not raise `CF` flag.

### `neg a`

`a = -a`

### `adc a, b`

`a += b + CF`

This command is generally used for qwords addition:
```
; calculate u+v
; u in (edx:eax), v in (ebx:ecx)
add eax, ecx
adc edx, ebx
```

`a` and `b` can't both be memory.

### `sbb a, b`

`a -= b + CF`

`a` and `b` can't both be memory.

This command is generally used for qwords subtraction:
```
; calculate u-v
; u in (edx:eax), v in (ebx:ecx)
sub eax, ecx
sbb edx, ebx
```

Multiplication and Division
===========================

### `mul a`

Multiplier type | Operation performed
--------------- | -------------------
`byte` | `ax = al * a`
`word` | `(dx:ax) = ax * a`
`dword` | `(edx:eax) = eax * a`

`mul` multiplies unsigned numbers.

### `imul a`

Multiplier type | Operation performed
--------------- | -------------------
`byte` | `ax = al * a`
`word` | `(dx:ax) = ax * a`
`dword` | `(edx:eax) = eax * a`

`imul` multiplies signed numbers.

### `imul a, b`

`a *= b`

`a` and `b` have to be of same type.

This two-operand version of `imul` works both for signed and unsigned numbers.

### `imul a, b, c`

`a = b * c`

`c` has to be a constant, `a` and `b` have to be of same type.

This three-operand version of `imul` works both for signed and unsigned numbers.

### `div a`

Divider type | Operation performed
------------ | -------------------
`byte` | `al = ax / a` <br> `ah = ax % a`
`word` | `ax = (dx:ax) / a` <br> `dx = (dx:ax) % a`
`dword` | `eax = (edx:eax) / a` <br> `edx = (edx:eax) % a`

`div` operates with unsigned numbers.

*Warning:* before performing division with `word` or `byte` types
be sure to convert registers (`ax` or `eax`) to appropriate types.

### `idiv a`

Divider type | Operation performed
------------ | -------------------
`byte` | `al = ax / a` <br> `ah = ax % a`
`word` | `ax = (dx:ax) / a` <br> `dx = (dx:ax) % a`
`dword` | `eax = (edx:eax) / a` <br> `edx = (edx:eax) % a`

`idiv` operates with signed numbers.

*Warning:* before performing division with `word` or `byte` types
be sure to convert registers (`ax` or `eax`) to appropriate types.

### `lea a, [address]`

`lea` calculates an `address` expression and writes it back to `a`.

`address` is an expression formatted like this:
`base + index * scale + displacement`. `base` is a register,
`index` is any register except `esp`, `scale` is a number
from {0, 1, 2, 4, 8}, `displacement` is an arithmetic expression.
The order is not important, and it's even possible to put different
parts of `displacement` to different places. While each
of the three summands can be absent, it is not possible to use
several summands of the same type (use several `lea` instructions
in a row for that).

Data Transfer and Size Conversion
==================================

### `mov a, b`

`a = b`

`a` and `b` can't both be memory.

### `xchg a, b`

`a, b = b, a`

A fast way to exchange two numbers.

`a` and `b` can't both be memory.

### `movzx a, b`

`a = b`

`a` has to be longer than `b`. The remaining space will be filled with zeroes.

`a` and `b` can't both be memory.

### `movsx a, b`

`a = b`

`a` has to be longer than `b`. The remaining space will be filled with with the first bit
of `a`, which denotes the sign for signed numbers.

`a` and `b` can't both be memory.

### `cdq`

Equivalent to:
```
mov edx, eax
shr edx, 31
```

This instruction is generally used to convert dwords to qwords before performing
signed division.

### `cwd`

Equivalent to:
```
mov dx, ax
shr dx, 15
```

This instruction is generally used to convert words to dwords before performing
signed division.

### `cbw`

Equivalent to:
```
movsx ax, al
```

This instruction is generally used to convert bytes to words before performing
signed division.

### `cwde`

Equivalent to:
```
movsx eax, ax
```

Execution Control and Stack Management
======================================

### `jmp label`

Continue the execution from the instruction that's labelled `label`.

### `call label`

Push the address of the next instruction onto the stack, then `jmp label`.

This instruction is usually used to call procedures and functions, since the
address it puts on stack can be used as return address after the callee exits.

### `ret`

Pop an address from the stack and `jmp` there.

This instruction is usually used together with `call` to organize function calling.

### `push a`

Roughly equivalent to:
```
sub esp, sizeof(a)
mov dword[esp], a
```

This instruction pushes a value onto stack, decrementing stack pointer
by its size. Unlike the code above, it can work with memory locations
and does not affect flags.

### `pop a`

Roughly equivalent to:
```
mov a, dword[esp]
add esp, sizeof(a)
```

This instruction pushes a value onto stack, incrementing stack pointer
by its size. Unlike the code above, it can work with memory locations
and does not affect flags. Note that the data is not erased or destroyed
in any way.

*Note:* to pop a value without storing it, use `add esp, sizeof(a)`.

### `leave`

Equivalent to:
```
mov esp, ebp
pop ebp
```

This instruction is usually used for restoring the stack state at the end of a
function or a procedure.

### `pushad`

Roughly equivalent to:
```
mov dword[esp +  4], eax
mov dword[esp +  8], ecx
mov dword[esp + 12], edx
mov dword[esp + 16], ebx
mov dword[esp + 20], esp
mov dword[esp + 24], ebp
mov dword[esp + 28], esi
mov dword[esp + 32], edi
sub esp, 32
```

This instruction pushes nearly all registers to the stack. Unlike
the code above it does not affect flags.

### `popad`

Roughly equivalent to:
```
add esp, 32
mov eax, dword[esp +  4]
mov ecx, dword[esp +  8]
mov edx, dword[esp + 12]
mov ebx, dword[esp + 16]
; do not mov esp, dword[esp + 20]
mov ebp, dword[esp + 24]
mov esi, dword[esp + 28]
mov edi, dword[esp + 32]
```

This instruction pops nearly all registers from the stack. Unlike
the code above it does not affect flags.

Bitwise Operations
==================

### `and a, b`

`a &= b`

`a` and `b` can't both be memory.

### `or a, b`

`a |= b`

`a` and `b` can't both be memory.

### `xor a, b`

`a ^= b`

`a` and `b` can't both be memory.

This instruction is often used in form of `xor a, a` in order to set `a` to zero.
It is shorter than a simple `mov a, 0` when translated to the machine code.

### `not a`

`a = ~a`

`~a` equals `(-a-1)` for signed numbers and `(maxval - a)` for unsigned ones.

### `shl a, b`

`a <<= b % 32`

`b` can be either a constant or the `cl` register.

`CF` flag is set to the last bit that was shifted out. All the shifted in bits are
filled with zeroes. If `(b % 32)` equals `1`, `OF` is set to `CF^SF`.

*Note:* this is the same as the `sal` instruction.

### `sal a, b`

`a <<= b % 32`

`b` can be either a constant or the `cl` register.

`CF` flag is set to the last bit that was shifted out. All the shifted in bits are
filled with zeroes. If `(b % 32)` equals `1`, `OF` is set to `CF^SF`.

*Note:* this is the same as the `shl` instruction.

### `shr a, b`

`a >>= b % 32`

`b` can be either a constant or the `cl` register.

`CF` flag is set to the last bit that was shifted out. All the shifted in bits are
filled with zeroes.

### `sar a, b`

`a >>= b % 32`

`b` can be either a constant or the `cl` register.

`CF` flag is set to the last bit that was shifted out. All the shifted in bits are
filled with the sign bit of `a`.

Conditionals
============

### `jCC label`

Perform `jmp label` if the condition holds true.

Some instructions are only flag-based and some make sense if executed after `cmp` instruction.

The following table specifies possible meanings of using conditional jumps
after `cmp a, b` instruction:

 CC | Alternative CC | Flags | Meaning | Signity
:--:|:--------------:|:----- |:-------:|:-------:
`e` | `z` | `ZF` | `a == b` | Both
`ne` | `nz` | `!ZF` | `a != b` | Both
`ge` | `nl` | `SF == OF` | `a >= b` | Signed
`g` | `nle` | `SF == OF` and `!ZF` | `a > b` | Signed
`le` | `ng` | `SF != OF` or `ZF` | `a <= b` | Signed
`l` | `nge` | `SF != OF` | `a < b` | Signed
`ae` | `nb` | `!CF` | `a >= b` | Unsigned
`a` | `nbe` | `!CF` and `!ZF` | `a > b` | Unsigned
`be` | `na` | `CF` or `ZF` | `a <= b` | Unsigned
`b` | `nae` | `CF` | `a < b` | Unsigned

Flag-based instructions:

 CC | Flags
:--:|:-----:
 `z` | `ZF`
 `c` | `CF`
 `o` | `OF`
 `s` | `SF`
 `p` | `PF`
 `nz` | `!ZF`
 `nc` | `!CF`	
 `no` | `!OF`
 `ns` | `!SF`
 `np` | `!PF`

### `jecxz label`

Eqivalent to:

```
test ecx, ecx
jz label
```

### `loop label`

Equivalent to:
```
dec ecx
jnz label
```

This instruction is usually used for implementing loops with post-condition where
`ecx` is used as loop counter.

### `setCC a`

`a = CC ? 1 : 0`

`a` has to be a single byte.

This instruction sets `a` to `1` if the condition holds true and to zero otherwise.

### `cmovCC a, b`

Perform `mov a, b` if the condition holds true.

`a` and `b` both have to be registers.
