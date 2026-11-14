import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

def generate_services_flyer():
    base_path = r'C:\Users\HP\.gemini\antigravity\brain\bba28862-0b36-4311-97c7-f9d4bc141d43\.user_uploaded\media_1794609886112_f59a006c.jpg'
    base = Image.open(base_path).convert('RGB')
    draw = ImageDraw.Draw(base)

    # 1. Top Header: Clear 'DEBUG LAB' and paste official Veltrix Hub logo with tagline
    draw.rectangle([250, 15, 770, 172], fill=(255, 255, 255))
    tight_logo = Image.open('scratch/tight_logo.png')
    aspect = tight_logo.width / tight_logo.height
    logo_h = 115
    logo_w = int(logo_h * aspect)
    logo_resized = tight_logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    logo_x = (1024 - logo_w) // 2
    logo_y = 44
    base.paste(logo_resized, (logo_x, logo_y))

    # 2. QR Code: generate official WhatsApp link
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=5,
        border=1,
    )
    qr.add_data('https://wa.me/2348087098270?text=Hello%20Veltrix%20Hub,%20I%20would%20like%20a%20free%20review%20of%20my%20business%20presence!')
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color='black', back_color='white').convert('RGB')
    qr_resized = qr_img.resize((136, 136), Image.Resampling.LANCZOS)

    # Clear QR container box on flyer (x: 60 to 218, y: 785 to 938)
    draw.rectangle([60, 785, 218, 938], fill=(255, 255, 255))
    draw.rectangle([60, 785, 218, 938], outline=(210, 215, 225), width=2)
    base.paste(qr_resized, (71, 794))

    # 3. Additional Services Banner (x: 235 to 925, y: 772 to 854)
    draw.rounded_rectangle([235, 772, 925, 854], radius=10, fill=(248, 250, 252), outline=(226, 232, 240), width=2)
    font_tag = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 12)
    font_text = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 14)
    font_dot = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 15)

    # Badge: ALSO SPECIALIZING IN
    draw.rounded_rectangle([248, 782, 396, 804], radius=5, fill=(33, 28, 58))
    draw.text((257, 785), 'ALSO SPECIALIZING IN', fill=(255, 255, 255), font=font_tag)

    # Line 1: Corporate Branding & UI/UX • Website Maintenance & Care
    draw.text((410, 785), 'Corporate Branding & UI/UX', fill=(30, 41, 59), font=font_text)
    draw.text((630, 783), '•', fill=(212, 140, 40), font=font_dot)
    draw.text((648, 785), 'Website Maintenance & Care', fill=(30, 41, 59), font=font_text)

    # Line 2: CAC Business Registration • SEO & Google Visibility • E-Commerce
    draw.text((250, 820), 'CAC Business Registration', fill=(30, 41, 59), font=font_text)
    draw.text((455, 818), '•', fill=(212, 140, 40), font=font_dot)
    draw.text((472, 820), 'SEO & Google Ranking', fill=(30, 41, 59), font=font_text)
    draw.text((650, 818), '•', fill=(212, 140, 40), font=font_dot)
    draw.text((668, 820), 'E-Commerce Portals', fill=(30, 41, 59), font=font_text)

    # 4. Website & Social Row (y: 862 to 918)
    draw.rectangle([230, 860, 1000, 920], fill=(255, 255, 255))
    tight_web = Image.open('scratch/tight_web.png')
    tight_social = Image.open('scratch/tight_social.png')

    # Scale slightly to height 44
    web_h = 44
    web_w = int(web_h * (tight_web.width / tight_web.height))
    web_scaled = tight_web.resize((web_w, web_h), Image.Resampling.LANCZOS)

    soc_h = 44
    soc_w = int(soc_h * (tight_social.width / tight_social.height))
    soc_scaled = tight_social.resize((soc_w, soc_h), Image.Resampling.LANCZOS)

    base.paste(web_scaled, (390, 868))
    base.paste(soc_scaled, (390 + web_w + 35, 868))

    # 5. Bottom Navy Bar: WhatsApp & Phone
    draw.rectangle([250, 924, 600, 1018], fill=(33, 28, 58))
    font_phone_lbl = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 17)
    font_phone_num = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 31)

    draw.text((288, 936), 'Call or WhatsApp us on', fill=(212, 186, 101), font=font_phone_lbl)
    draw.text((288, 960), '+2348087098270', fill=(255, 255, 255), font=font_phone_num)

    # Save to public and dist
    out_path = r'apps\web\public\designs\veltrix-design-6.jpg'
    base.save(out_path, quality=96)
    dist_dir = r'apps\web\dist\designs'
    if os.path.exists(dist_dir):
        base.save(os.path.join(dist_dir, 'veltrix-design-6.jpg'), quality=96)

    print('Successfully generated services flyer at:', out_path)

if __name__ == '__main__':
    generate_services_flyer()
