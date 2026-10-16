// Planar 2R arm. Radians, counterclockwise; b is relative to link 1.
export function forward(a,b,l1,l2){
 const ex=l1*Math.cos(a),ey=l1*Math.sin(a);
 return {ex,ey,x:ex+l2*Math.cos(a+b),y:ey+l2*Math.sin(a+b)};
}
export function inverse(x,y,l1,l2,sign=1){
 const r=Math.hypot(x,y),min=Math.abs(l1-l2),max=l1+l2;
 const reachable=r>=min-1e-10&&r<=max+1e-10;
 const infinite=r<1e-10&&min<1e-10;
 const projected=Math.max(min,Math.min(max,r));
 const direction=r<1e-10?0:Math.atan2(y,x);
 const px=projected*Math.cos(direction),py=projected*Math.sin(direction);
 const c=Math.max(-1,Math.min(1,(projected**2-l1*l1-l2*l2)/(2*l1*l2)));
 const b=sign*Math.acos(c);
 const a=infinite?0:Math.atan2(py,px)-Math.atan2(l2*Math.sin(b),l1+l2*Math.cos(b));
 return {a,b,reachable,infinite,px,py};
}
