# Generates local placeholder artwork so the site runs out of the box. Replace with your own photos (same filenames).
from PIL import Image, ImageDraw, ImageFilter
import random, os
random.seed(7); O='public/images/'; os.makedirs(O,exist_ok=True)
def grad(w,h,top,bot):
    im=Image.new('RGB',(w,h)); d=ImageDraw.Draw(im)
    for y in range(h):
        t=y/h; d.line([(0,y),(w,y)],fill=tuple(int(top[i]+(bot[i]-top[i])*t) for i in range(3)))
    return im
def hills(w,h,sky,cols):
    im=grad(w,h,*sky); d=ImageDraw.Draw(im)
    for k,c in enumerate(cols):
        base=h*(.55+.12*k); pts=[(0,h)]
        for x in range(0,w+40,40): pts.append((x,base+random.randint(-70,70)-60*((x/w-.5)**2)*4))
        pts.append((w,h)); d.polygon(pts,fill=c)
    return im.filter(ImageFilter.GaussianBlur(2))
def dash(w=1200,h=760,acc=(109,40,217),title='Dashboard'):
    im=Image.new('RGBA',(w,h),(255,255,255,255)); d=ImageDraw.Draw(im)
    d.rectangle([0,0,w,56],fill=acc); d.text((20,20),'NGriffin Pay  |  '+title,fill='white')
    d.rectangle([0,56,90,h],fill=(35,18,80))
    for i in range(4): d.rounded_rectangle([120+i*265,80,360+i*265,170],10,outline=(225,225,240),fill=(250,250,254)); d.text((140+i*265,110),['Payroll','Attendance','Performance','Hiring'][i],fill=(60,60,90))
    d.rounded_rectangle([120,200,520,430],10,outline=(225,225,240))
    pts=[(140+i*55,400-random.randint(30,170)) for i in range(7)]; d.line(pts,fill=acc,width=4)
    for i in range(6):
        hh=random.randint(40,200); x=580+i*60; d.rectangle([x,420-hh,x+36,420],fill=(120+i*15,90,220))
    d.rounded_rectangle([860,200,1180,430],10,outline=(225,225,240))
    for i in range(5): d.rounded_rectangle([880,225+i*40,1160,250+i*40],6,fill=(243,240,255))
    d.rounded_rectangle([120,460,1180,720],10,outline=(225,225,240))
    for i in range(5): d.rectangle([160+i*190,680-random.randint(60,200),200+i*190,680],fill=(88,80,220))
    return im
def phone(acc,title):
    w,h=300,600; im=Image.new('RGBA',(w,h),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle([0,0,w-1,h-1],36,fill=(20,20,30)); d.rounded_rectangle([10,10,w-11,h-11],28,fill='white')
    d.rounded_rectangle([10,10,w-11,70],28,fill=acc); d.text((30,34),title,fill='white')
    for i in range(6): d.rounded_rectangle([28,100+i*72,w-28,150+i*72],10,fill=(243,240,255))
    return im
def circ(n,c):
    im=Image.new('RGBA',(160,160),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.ellipse([20,20,140,140],fill=c); d.text((72,74),str(n),fill='white'); im.save(O+f'int-{n}.png')
accs=[(109,40,217),(37,99,235),(5,150,105),(217,119,6),(190,24,93),(8,145,178)]
sk=[((255,170,120),(110,60,190)),((120,170,255),(40,50,140)),((255,200,130),(90,50,140)),((90,60,170),(230,140,120)),((60,40,130),(250,170,150)),((20,60,120),(130,200,200))]
sv=['Payroll','HRIS','Hiring','Attendance','Performance','Projects']
for i in range(6):
    hills(1100,760,sk[i],[(70,60,150),(50,40,120),(30,25,90)]).save(O+f'svc-bg-{i}.jpg',quality=88)
    dash(title=sv[i],acc=accs[i]).save(O+f'svc-desktop-{i}.png'); phone(accs[i],sv[i]).save(O+f'svc-mobile-{i}.png')
for i in range(12): circ(i+1,accs[i%6])
dash().save(O+'dashboard-desktop.png')
hills(2000,1100,((120,170,235),(250,210,150)),[(90,150,70),(60,120,60),(40,95,50)]).save(O+'mountain-bg1.jpg',quality=90)
p=Image.new('RGBA',(2000,420),(0,0,0,0)); d=ImageDraw.Draw(p)
for x in (300,520,1250,1480,1700):
    d.ellipse([x,40,x+80,120],fill=(235,190,150)); d.rounded_rectangle([x-25,120,x+105,420],30,fill=(30,50,110))
p.save(O+'people-foreground.png')
hills(1000,760,((120,170,255),(255,200,150)),[(70,100,170),(50,70,140)]).save(O+'team.jpg')
for i in range(3):
    im=Image.new('RGBA',(120,120),(0,0,0,0)); ImageDraw.Draw(im).rounded_rectangle([0,0,119,119],24,fill=(237,233,254)); im.save(O+f'icon-{i}.png')
    hills(800,700,sk[i],[(90,70,170),(60,45,130)]).save(O+f'ai-{i+1}.jpg')
    d2=dash(600,380,accs[i],'Ask'); Image.open(O+f'ai-{i+1}.jpg').convert('RGBA').paste(d2,(100,150)) if False else None
for n in ('logo','logo-balloon'):
    im=Image.new('RGBA',(400,400),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.ellipse([90,20,310,290],fill=(124,58,237)); d.polygon([(150,280),(250,280),(215,340),(185,340)],fill=(88,40,170)); d.text((190,140),'NG',fill='white'); im.save(O+n+'.png')
grad(1200,630,(42,17,112),(214,138,160)).save(O+'og.jpg')
