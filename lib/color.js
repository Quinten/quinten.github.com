function hsl2rgb(h,s,l)
{
  let a=s*Math.min(l,1-l);
  let f= (n,k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1),-1);
  return [f(0),f(8),f(4)];
}

function rgb2hsl(r,g,b) {
  let v=Math.max(r,g,b), c=v-Math.min(r,g,b), f=(1-Math.abs(v+v-c-1));
  let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c));
  return [60*(h<0?h+6:h), f ? c/f : 0, (v+v-c)/2];
}

//console.log('dark red', rgb2hsl(192/255, 57/255, 43/255)); // [5.63758389261745, 0.6340425531914893, 0.4607843137254902]
//console.log('light red', rgb2hsl(231/255, 76/255, 60/255)); // [5.614035087719298, 0.7808219178082192, 0.5705882352941176]
//console.log('dark blue', rgb2hsl(41/255, 128/255, 185/255)); // [203.74999999999997, 0.6371681415929203, 0.44313725490196076]
//console.log('light blue', rgb2hsl(52/255, 152/255, 219/255)); // [204.07185628742516, 0.6987447698744769, 0.5313725490196078]
//console.log('dark green', rgb2hsl(39/255, 174/255, 96/255)); //[145.33333333333331, 0.6338028169014084, 0.4176470588235294]
//console.log('light green', rgb2hsl(46/255, 204/255, 113/255)); // [145.44303797468353, 0.632, 0.4901960784313726]

function getColor(h, s, l) {
    let [r, g, b] = hsl2rgb(h, s, l);
    return {
        h,
        s,
        l,
        r,
        g,
        b,
        hsl: 'hsl(' + h + ',' + Math.floor(s * 100) + '%,' + Math.floor(l * 100) + '%)'
    };
}

function getRandomColorScheme() {
    let h = Math.floor(Math.random() * 361);
    return {
        base: getColor(h, 0.63, 0.44),
        lite: getColor(h, 0.63, 0.53),
        dark: getColor(h, 0.63, 0.13),
        pale: getColor(h, 0.63, 0.84)
    };
}

export default {
    getRandomColorScheme
}
