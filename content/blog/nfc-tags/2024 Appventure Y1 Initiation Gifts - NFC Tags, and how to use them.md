---
title: 2024 AppVenture Y1 Initiation Gifts - NFC Tags, and how to use them
slug: nfc-tags
author: [kaiwen, liuwenkai]
date: 2023-12-22
tags: [educational]
---
![AppVenture Logo left-align](./appventure_logo_100px.svg)

_by **AppVenture**, NUSH's Computer Science Interest Group_

## Hi!

Welcome to NUS High! We are AppVenture, NUSH's Computer Science Interest Group. Come down to our booth during IG Fair to learn more about us, and follow us on Instagram at **[@appventure\_nush](https://www.instagram.com/appventure_nush)** for interesting posts about computer science!

Or: browse this current website you are on, [nush.app](https://nush.app/), which is made and maintained by our members! 

## What are NFC Tags?

Near Field Communication (NFC) technology allows wireless communication between two electronic devices close to each other, at a distance of up to 1.5 inches (3.81 cm).

The most common example is communication between a device like a smartphone (active - has a power source) and a readable NFC tag (passive - no power source). This communication is possible because the reading device, often your smartphone, can generate a radio frequency (RF) field to power the tag. In Singapore, you can use your phone's NFC capabilities to pay for transit fares at the EZ-Link readers!

The NFC tag you're holding has many applications! Do your best to use this NFC tag in fun and interesting ways :)

Here's some example applications (we encourage you to come up with more!):

1. Directing people to websites (like in this case), or launching applications
2. Contactless payments, similar to Google Pay and Apple Pay
3. Automating tasks, like connecting to Wi-Fi or Bluetooth networks, unlocking smart locks, authenticating (2FA) with security key, or triggering shortcuts/automation on your phone (eg. iOS Shortcuts, for Android you can use other 3rd party apps)
4. Creative purposes, like sharing media content, or creating digital business cards
5. Other cool stuff like setting focus modes, silencing your phone, controlling smart home accessories, playing your favorite music, or setting timers

## How to program your NFC Tag

The NFC tag you've been given is a rewritable NFC tag: As long as you have an NFC tag writer application on your phone and NFC support on your phone, you can program it! Hence, you can reuse it for as many applications as you would like.

**You may need to go to your phone settings to enable NFC.** If there is no NFC support in your settings and you can't get the tag to work, your phone may not support NFC: phones &geq; Android 10/iOS 13 should be supported (which is most phones made in the last 6 years).

To read/write the NFC tag, put the NFC tag on the back of your phone, near the camera area. If it doesn't work, try taking off your phone case or moving the NFC tag all over the back of your phone.

### For both Android and iOS

Download the app "_NFC TagWriter by NXP_". There are other NFC tag apps you can install that will work (and any will work), but this is among the most popular ones.
![Tagwriter](./tagwriter.png)

**The app has the below functions:**
- _Read tags_ &ndash; reads the content of the tag. Useful to check what information an unknown tag stores, and see if it's malicious or not
- **_Write tags_** &ndash; what we want to do. Writes new instructions/information to the tag.
- _Erase tags_ &ndash; erases the contents of a tag
- _Protect tags_ &ndash; sets a password on your tag to prevent anyone from just overwriting it, hence "protecting" it. 

_**Warning**: once you "lock" your tag (not "protect"), nobody (not even you) can write it again, and it will be read-only, so **do not lock your tag** unless you are very sure that you never want to edit it again!_

If you're a fan of long PDFs, you can also refer to the official documentation [here](https://inspire.nxp.com/tagwriter/tag-writer-user-manual.pdf), for more advanced functionalities. If there's any feature you don't understand, we encourage you to search it online and find out for yourself!

### Simple writing guide
Open TagWriter, and you should see the below screen.
![Tagwriter Home Page](./tagwriter_home.png)

"Dataset" refers to the instructions you want to give your NFC tag. The app automatically saves prior instructions in "My datasets".

1. Press "Write tags", then press "New dataset" to start writing to your NFC tag.
    ![Tagwriter Write Screen](./tagwriter_write_1.jpg)
2. Choose what to write from a variety of options, and enjoy!
    ![Tagwriter Write 2](./tagwriter_write_2.jpg)

If you have any queries or still can't get it to work, you can DM **[@appventure\_nush](https://www.instagram.com/appventure_nush)** on Instagram or email us at [appventure@nushigh.edu.sg](mailto:appventure@nushigh.edu.sg), or come to our booth during IG Fair! Tag us on Instagram to showcase your creative applications, or tell us during IG Fair :)

We hope you will explore more about NFC tags and use this NFC tag creatively. After all, experiment, explore, excel!

Signing off,<br/>
AppVenture Exco 2024<br/>
![AppVenture Logo left-align](./appventure_logo_50px.svg)

*The tags are [here](https://www.amazon.sg/MATCHEASY-Waterproof-Rewritable-Compatible-Rectangular/dp/B0BZHZN7XM/ref=sr_1_3_sspa?adgrpid=98545307246&hvadid=587467106582&hvdev=c&hvlocphy=9062518&hvnetw=g&hvqmt=b&hvrand=11534621183993269782&hvtargid=kwd-299920919263&hydadcr=7631_340284&keywords=nfc%2B215&qid=1700834499&sr=8-3-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1) if you want more product information.*
