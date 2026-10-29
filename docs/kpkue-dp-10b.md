# KPKUE DP-10B (Frameo, RK3326-family, Android 8.1)

Report from one owner-operated unit, tested on 2026-10-28/29 with an Apple silicon Mac
(M1 MacBook Air) running macOS. Bought from
[Amazon.ca, B0FFHNT5LK](https://www.amazon.ca/dp/B0FFHNT5LK). Match the board and firmware
below: a listing or the Android model alone is not enough.

**Verified result:** shipped root (`su -c id` returns `uid=0`) and a dashboard starts
automatically after a full power cycle, once the kiosk is installed and set as the Home app.
No UART, soldering or offline partition editing was needed on this unit — both the Android
model (`DP105F`) and GPT partition layout (16 partitions on `mmcblk2`, matching the recorded
sector table) match the [QCREA YYD-1156](qcrea-yyd-1156.md) report, which is likely the same
underlying board under a different brand/case.

## Identity

| Item | Observed value |
| --- | --- |
| Case brand / model | `KPKUE` / `DP-10B` |
| Frameo application | `v1.29.10 (59940)` |
| Android model | `DP105F` |
| Android version / API | `8.1.0` / API 27 |
| Manufacturer prop | `rockchip` |
| Serial | `7E631001` |
| Block device | `mmcblk2` (16 partitions, `mmcblk2p1`–`mmcblk2p16`, plus `mmcblk2boot0/1` and `mmcblk2rpmb`) |
| eMMC user-area size | 62,545,461,248 bytes (58.25 GiB) |
| Display | Advertised 1440×1080 (4:3); `wm density` reports 160 |
| Root | Shipped `su` works with no prompt: `adb shell su -c id` → `uid=0(root) gid=0(root) ... context=u:r:toolbox:s0` |

Same Android model (`DP105F`) as the QCREA YYD-1156 and the Pastigio FRAME156/157 rows in the
device index: check the firmware/serial string on your own unit before assuming an identical
board revision.

## Ports: USB-A is host-only, USB-C is the data/ADB port

This unit has four external connectors: a USB-A port, a USB-C port, a barrel power jack and an
SD card slot. They are not interchangeable:

- The **USB-A port** is a host port, for plugging a phone or USB drive *into* the frame to
  import photos. Connecting a phone there made the frame itself show an `MTP Host has
  stopped` error, i.e. the frame was trying to act as the USB host and read the phone's
  photos over MTP, not the other way round. Plugging a Mac's own USB-A/USB-C port into this
  port does nothing useful: both ends are host-only, and a plain USB link needs one host and
  one device.
- The **USB-C port** is the one that matters for ADB. Frameo's own "Enable transfer from
  computer" help text describes mounting the frame as a drive in Windows Explorer; macOS has
  no built-in MTP support at all, so the frame never appears as a Finder volume regardless of
  which port or cable is used. That is expected and unrelated to whether ADB is working.

## Getting ADB to enumerate: a USB-C hub fixed it

With **Frameo Settings → About → Beta Program → ADB Access** turned on, and the cable
going straight from the MacBook's USB-C port to the frame's USB-C port, `adb devices` printed
only the header line (`List of devices attached`, no rows) no matter the cable (including a
cable independently verified to carry data, not just power), the port used, or how many times
the frame or Mac were rebooted. `system_profiler SPUSBDataType` showed nothing either: the
frame was not enumerating on the bus at all. The frame also draws no power through this USB-C
port (unplugging its own barrel-jack charger turns it off immediately), which was an early
hint that the port's physical connection was questionable.

**Routing the same cable through a plain USB-C multiport hub, between the MacBook and the
frame, made the frame enumerate immediately.** No change to any setting, cable or port was
needed beyond adding the hub in the middle:

```sh
adb devices
# List of devices attached
# 4NAY7EM2BE      device
```

The cause was not isolated further (the hub's own chipset may renegotiate the USB
power/data handshake more cleanly than a direct link on this particular port). If USB-C ADB
is not enumerating on a similar board, trying a passive multiport hub in between is worth the
five minutes before assuming a UART/solder route is required.

## Root and kiosk install

No boot patch or offline userdata edit was needed:

```sh
adb shell su -c id
# uid=0(root) gid=0(root) groups=0(root) context=u:r:toolbox:s0
```

From there, the standard kiosk build-and-install steps in the
[dashboard kiosk README](../dashboard/kiosk/README.md#build-and-install) worked without
modification:

```sh
ANDROID_HOME=/path/to/android-sdk bash kiosk/build.sh
adb install -r kiosk/build/homehq.apk
adb shell am start -n com.wesbos.homehq/.MainActivity --ez home true
adb shell cmd package set-home-activity com.wesbos.homehq/.Home
```

Waited about 30 seconds after the last two commands before power-cycling, per the README's
warning about Android needing time to persist the Home-app preference. A full power
disconnect/reconnect then booted straight into the dashboard with no further ADB needed.

## Known issue: letterboxing on this screen's aspect ratio

The dashboard's layout keeps an 800 px height and widens for wider screens, per the kiosk
README's [screen density](../dashboard/kiosk/README.md#screen-density) notes. This panel's
advertised 1440×1080 is closer to 4:3 than the 16:10/16:9 panels the layout assumes, which
produces black letterboxing bars at the top and bottom. `wm density` already reports the
expected `160`, so this is not a density mismatch; it is unresolved and left as a follow-up
for this device profile.
