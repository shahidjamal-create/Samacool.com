import os
import shutil

source_dir = r"C:\Users\HP\.gemini\antigravity-ide\brain\767ef714-a85d-492b-bb45-1e9513dd4ca7"
target_dir = r"c:\Users\HP\OneDrive\Desktop\Document\SAMA WEBSITE"

mapping = {
    "wm_samsung_front_load_1789783782985.jpg": "WmSamsung.webp",
    "wm_lg_front_load_1789783933361.jpg": "WmLG.webp",
    "wm_whirlpool_top_load_1789783957567.jpg": "WmWhirlpool.webp",
    "wm_ifb_front_load_1789784021565.jpg": "WmIFB.webp",
    "wm_bosch_front_load_1789784069688.jpg": "WmBosch.webp",
    "wm_godrej_top_load_1789784096719.jpg": "WmGodrej.webp",
    "wm_haier_front_load_1789784124180.jpg": "WmHaier.webp",
    "wm_panasonic_top_load_1789784161758.jpg": "WmPanasonic.webp",
    "wm_voltas_beko_front_load_1789784204814.jpg": "WmVoltasBeko.webp",
    "wm_lloyd_top_load_1789784232594.jpg": "WmLloyd.webp",
}

try:
    from PIL import Image
    has_pil = True
except ImportError:
    has_pil = False

print(f"PIL available: {has_pil}")

for src_name, tgt_name in mapping.items():
    src_path = os.path.join(source_dir, src_name)
    tgt_path = os.path.join(target_dir, tgt_name)
    if os.path.exists(src_path):
        if has_pil:
            with Image.open(src_path) as img:
                img.save(tgt_path, "WEBP", quality=90)
                print(f"Converted {src_name} -> {tgt_name} (WEBP)")
        else:
            shutil.copyfile(src_path, tgt_path)
            print(f"Copied {src_name} -> {tgt_name}")
    else:
        print(f"Source not found: {src_path}")

# Also update featured Washing Machine.webp on homepage
wm_home_src = os.path.join(source_dir, "wm_lg_front_load_1789783933361.jpg")
wm_home_tgt = os.path.join(target_dir, "Washing Machine.webp")
if os.path.exists(wm_home_src):
    if has_pil:
        with Image.open(wm_home_src) as img:
            img.save(wm_home_tgt, "WEBP", quality=90)
            print("Updated Washing Machine.webp (WEBP)")
    else:
        shutil.copyfile(wm_home_src, wm_home_tgt)
        print("Updated Washing Machine.webp")
