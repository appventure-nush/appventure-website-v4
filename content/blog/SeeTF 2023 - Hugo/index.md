---
title: SeeTF 2023 Writeups
slug: SeeTF-2023
author: [hugomaxlim]
date: 2023-6-21
tags: [ctf,writeup]
---

## Onelinecrypto

Category: Crypto

Entire Challenge:

## How to bypass this line?

```py
assert __import__('re').fullmatch(r'SEE{\w{23}}',flag:=input()) and not int.from_bytes(flag.encode(),'big')%13**37
```

The assert statement will return an error if the condition given is not fulfilled otherwise nothing is returned. The first part of the condition is doing a regex match of the form `SEE{\w{23}}`, thus the flag contains 23 characters in the curly braces. The second part of the condition ensures that the flag is divisible by $13^{37}$ in long form. 

I actually tried a lot of things at first like brute force and greedy from right to left, but they didn't even come close

The first realisation comes when I realised that a bytestring `b'abc'` can be represented as

$2^{16}\cdot$ `b'a'`$+2^8\cdot$ `b'b'` $+2^0 \cdot$ `b'c'`

so essentially you are trying to solve for

`b'SEE{...}'` $ + \sum_{i=1}^{23} 2^{8i} x_I \equiv 0 \pmod{13^{37}}$

where all of $x_i$ satisfies `\w`

By default I would have no idea how to implement this and it kinda looks impossible, but when trying this challenge I remembered hearing a lot of stuff about LLL to solve equations and I wanted to join in on the fun

So understanding LLL was quite the learning curve but essentially what it does is, given a lattice basis

$$
\begin{bmatrix}
    1 & 1 & 1\\
    -1 & 0 & 2\\
    3 & 5 & 6
\end{bmatrix}
$$

it will find multiple sets of (nonzero?) integers $a, b, c$ such that

$$
a \begin{bmatrix}
    1 & 1 & 1
\end{bmatrix} + b \begin{bmatrix}
    -1 & 0 & 2
\end{bmatrix} + c \begin{bmatrix}
    3 & 5 & 6
\end{bmatrix}
$$

is as "short" as possible, i.e. minimize the abs of all the values

This is definitely not totally correct but I havent fully figured it out

anyways we can try to get LLL to help us find $x_i$ for us to make the total $\pmod{13^{37}}$ as close as possible to 0.

Usually to minimize $ax_1 + bx_2 + cx_3$ you can use the matrix

$$
\begin{bmatrix}
    1 & 0 & 0 & x_1\\
    0 & 1 & 0 & x_2\\
    0 & 0 & 1 & x_3
\end{bmatrix}
$$

which would return some vectors looking like 

$$\begin{bmatrix}a & b & c & ax_1 + bx_2 + cx_3 \end{bmatrix}$$

, so similarly, here we can do

$$
\begin{bmatrix}
    1 & 0 & 0 & \dots  & 0 & 2^{8 \cdot 23}  \\
    0 & 1 & 0 & \dots  & 0 & 2^{8 \cdot 22} \\
    0 & 0 & 1 & \dots  & 0 & 2^{8 \cdot 21} \\
    \vdots & \vdots & \vdots & \ddots & \vdots \\
    0 & 0 & 0 & \dots  & 1 & 2^{8 \cdot 1} \\
\end{bmatrix}
$$

but since we are taking this $\pmod{13^{37}}$ we simply add another row to automatically reduce any result as such:

$$
\begin{bmatrix}
    1 & 0 & 0 & \dots  & 0 & 2^{8 \cdot 23}  \\
    0 & 1 & 0 & \dots  & 0 & 2^{8 \cdot 22} \\
    0 & 0 & 1 & \dots  & 0 & 2^{8 \cdot 21} \\
    \vdots & \vdots & \vdots & \ddots & \vdots \\
    0 & 0 & 0 & \dots  & 1 & 2^{8 \cdot 1} \\
    0 & 0 & 0 & \dots  & 0 & -13^{37} \\
\end{bmatrix}
$$

but now we have to consider how we initially have the bits of `SEE{}` which we will use $c$ to represent. we need to add this to the final column, but the problem is, how do we ensure that this vector will be multiplied by 1?

The way I did this is to basically "reward" it by adding $-1$ to the identity part of the matrix so that if it adds this row once those parts will "cancel" out nicely(unsure if needed). I also added another column so that I can check if this was added once

$$
\begin{bmatrix}
    1 & 0 & 0 & \dots  & 0 & 0 & 2^{8 \cdot 23}  \\
    0 & 1 & 0 & \dots  & 0 & 0 & 2^{8 \cdot 22} \\
    0 & 0 & 1 & \dots  & 0 & 0 & 2^{8 \cdot 21} \\
    \vdots & \vdots & \vdots & \ddots & \vdots \\
    0 & 0 & 0 & \dots  & 1 & 0 & 2^{8 \cdot 1} \\
    0 & 0 & 0 & \dots  & 0 & 0 & -13^{37} \\
    -1 & -1 & -1 & \dots  & -1 & 1 & c \\
\end{bmatrix}
$$

This way, if LLL finds a vector ending with $\begin{bmatrix}1&0\end{bmatrix}$, i'll know $c$ was only added once as that column only has a nonzero element in that row, and i'll also know that a valid solution for $x_i$ was found as the final column sums to 0.

But as inspired by the example given on the wikipedia page for LLL, the sum of the final column being 0 matters a LOT, and is actually the only sum we care to minimize (other than keeping the 2nd last column at 1), so what we can do is multiply a weight to this column to make it more important to minimize.

So, after doing testing, the first weights that worked for me was $2^{8*23}$ for the last 2 columns and $1$ for everything else. the implementation(sage):

```py
start = (2**(8*24) * bytes_to_long(b"SEE{") + bytes_to_long(b"}"))
W = diagonal_matrix([1]*23 + [2^(8*23), 2^(8*23)])
I = Matrix.identity(23)
right1 = Matrix([0] * 23).T
right2 = Matrix([2^(8*i) for I in range(1, 24)]).T
bottom1 = Matrix([0] * 23 + [0, -13^37])
bottom2 = Matrix([-1] * 23 + [1, start])
L = i.augment(right1).augment(right2).stack(bottom1).stack(bottom2)
sol = (L*W).LLL()/W
for I in sol:
    print(i)
```

and we actually get a row ending with $\begin{bmatrix}1&0\end{bmatrix}$, the final row, `(-19, 6, 1, -23, -3, -26, -6, -6, -16, 17, -24, -48, 16, 13, -22, -1, 11, 23, -38, 12, 6, 23, 7, 1, 0)`. 

To get the solution from here we re-add the 1 subtracted in the last row to the first 23 numbers

but anyways this still isnt the solution. quite obviously the values of $x_i$ here go into the negatives which dont make valid characters for the flag. what characters are even valid anyway?
```py
good=""
for I in string.printable:
    if __import__('re').fullmatch(r'\w', i):
        good+=i
```
`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_`

Yeah this is not a lot to work with but whatever. anyways, to make the values obtained more positive and around these values, I realised that since they are currently kind of distributed around 0, and I have to add 1 to compensate for the last row, what if I just make it so I have to add a lot more?

Essentially, set those values to not -1 but like -90, so that after adding 90 I get nice values. doing this and adding back 90, we get the values

`116, 76, 65, 94, 109, 94, 73, 93, 79, 75, 96, 109, 73, 75, 108, 68, 89, 46, 111, 58, 92, 46, 63` which are way nicer and almost look correct. but actually, 9 of these numbers are invalid characters

From here, real hell began where I had to keep changing the offsets here and the weights to try to magically get a valid set of values. however, for unexplainable reasons I kept getting rows with 1 bad value (of 140 most of the time). this is probably because the challenge was set to make it so it was barely possible to find a valid string

Anyways after much experimentation, the final code that found the flag for me was


```py
found = False
while not found:
    offsets = [-93] * 23
    W = diagonal_matrix([random.choice([9/10, 1, 11/10]) for _ in range(23)] + [2^(3), 2^(7)])
    I = Matrix.identity(23)
    right1 = Matrix([0] * 23).T
    right2 = Matrix([2^(8*i) for I in range(1, 24)]).T
    bottom1 = Matrix([0] * 23 + [0, -13^37])
    bottom2 = Matrix(offsets + [1, start])
    L = i.augment(right1).augment(right2).stack(bottom1).stack(bottom2)
    sols = (L*W).LLL()/W
    for row in sols:
        if row[-2] == 1 and row[-1]==0:
            count = count3(row[:-2], offsets)
            if count==0:
                print(row[:-2])
                print("SEE{" + "".join([chr(row[:-2][x]-offsets[x]) for x in range(len(row[:-2]))])[::-1] + "}")
                found=True
            else:
                print("row:" + str(row))
                print("offsets:" + str(offsets))
                print("count:" + str(count))
```

giving `SEE{luQ5xmNUKgEEDO_c5LoJCum}` eventually.

## Semaphore
Category: Crypto

They give:

```py
import ecdsa # https://pypi.org/project/ecdsa/
import os

flag = os.environ.get('FLAG', 'SEE{not_the_real_flag}').encode()

sk = ecdsa.SigningKey.generate()
for nibble in flag.hex():
    signature = sk.sign(flag + nibble.encode())
    print(signature.hex())
```

Basically, for every digit in the flag's hex, they append that digit to the flag and then sign it with ecdsa, and print the signature. The thing is,
 1. Signatures are not meant to encrypt a message
 2. The fact that they randomly append a digit to the flag every time is highly suspicious

So doing a little bit of testing we can see that 

```py
flag = b"SEE{"
for nibble in flag.hex():
    print(flag + nibble.encode())
"""
b'SEE{5'
b'SEE{3'
b'SEE{4'
b'SEE{5'
b'SEE{4'
b'SEE{5'
b'SEE{7'
b'SEE{b'
"""
```

There are only 16 digits in hex and they get repeated quite often, so we are signing the same message in some cases, but how to use this to our advantage?

ECDSA:

$$r = (kG).x$$

$$s = k^{-1} (h + rd)$$

where k is a random nonce generated, h is the hashed message, and d is the private key

When comparing between two signatures of the same message, we can see that h and d remain the same, while r is known. so, how to deal with k? Seeing that we have $k$ and $k^{-1}$, yeah its quite obvious

$$R * s = kG * k^{-1} (h + rd) = G (h+rd)$$

Now, between two signatures of the same message, the only different variable is r, hence we can expect

$$s_1 - s_2 = G (h+r_1 d) - G(h+r_2 d) = G(r_1-r_2)d$$

You can use this to basically identify each character by comparing it to a signature of that character, and checking whether the difference multiplied by $(r_1-r_2)^{-1}$ is $Gd$, which is the same throughout

first compare to existing characters in SEE{}:

```py
p = 0xfffffffffffffffffffffffffffffffeffffffffffffffff
K = GF(p)
a = K(0xfffffffffffffffffffffffffffffffefffffffffffffffc)
b = K(0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1)
E = EllipticCurve(K, (a, b))
G = E(0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012, 0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811)
E.set_order(0xffffffffffffffffffffffff99def836146bc9b1b4d22831 * 0x1)
n = E.order()

sigs = []
for i in output.split("\n"):
    sigs.append(ecdsa.util.sigdecode_string(bytes.fromhex(i), order = E.order()))
sigs

#5345357b...
r1, s1 = sigs[0]
r2, s2 = sigs[3]
r3, s3 = sigs[2]
r4, s4 = sigs[4]
assert (E.lift_x(ZZ(r1)) * s1 - E.lift_x(ZZ(r2)) * s2) * pow(r1 - r2, -1, n)==(E.lift_x(ZZ(r3)) * s3 - -E.lift_x(ZZ(r4)) * s4) * pow(r3 - r4, -1, n)
Gd = (E.lift_x(ZZ(r1)) * s1 - E.lift_x(ZZ(r2)) * s2) * pow(r1 - r2, -1, n)

flag = list(b"SEE{".hex() + (len(sigs)-10) * "." + b"}".hex())
for i in tqdm([0,1,2,3,4,5,6,7,-2,-1]):
    r1, s1 = sigs[i]
    for j in range(len(sigs)):
        r2, s2 = sigs[j]
        a = E.lift_x(ZZ(r1)) * s1
        b = E.lift_x(ZZ(r2)) * s2
        try:
            thes = [(a-b) * pow(r1 - r2, -1, n), (a+b) * pow(r1 - r2, -1, n), (-a-b) * pow(r1 - r2, -1, n), (-a+b) * pow(r1 - r2, -1, n)]
        except Exception as e:
            continue
        if Gd in thes:
            flag[j] = flag[i]
```

and we get `5345457b.5..737.5.7..5..737.5....5.d....5.737.75.5.57.7.5.73...7....74757..55..4..7374.....775..73...57.7d`

For remaining digits:

```
for i in tqdm(range(len(flag))):
    if flag[i]==".":
        r1, s1 = sigs[i]
        for j in range(len(sigs)):
            r2, s2 = sigs[j]
            a = E.lift_x(ZZ(r1)) * s1
            b = E.lift_x(ZZ(r2)) * s2
            try:
                thes = [(a-b) * pow(r1 - r2, -1, n), (a+b) * pow(r1 - r2, -1, n), (-a-b) * pow(r1 - r2, -1, n), (-a+b) * pow(r1 - r2, -1, n)]
            except Exception as e:
                continue
            if Gd in thes:
                flag[j] = i**2
                flag[i] = i**2

def replace_all(lst, old, new):
    return [x if x!=old else new for x in lst]
h = flag
for j in range(7):
    h = replace_all(h, remaining[j], "TUVWXYZ"[j])

hh = replace_all(h, "T", "6")
hh = replace_all(hh, "Z", "1")
hh = replace_all(hh, "U", "9")
hh = replace_all(hh, "V", "f")
hh = replace_all(hh, "X", "e")
realflag = ""
for i in range(0, len(hh), 2):
    if hh[i] not in "TUVWXYZ" and hh[i+1] not in "TUVWXYZ":
        print(hh[i]+hh[i+1] + "   " + bytes.fromhex(hh[i]+hh[i+1]).decode())
        realflag+=bytes.fromhex(hh[i]+hh[i+1]).decode()
    else:
        print(hh[i]+hh[i+1])
        realflag+="?"
```

which gets `SEE{easy_?easy_?emon_squee?y_signatu?e_distinguis?e?}` and the remaining digits can be guessed
