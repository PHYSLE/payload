const img = new Image()
img.src = 'assets/images/particle.png'

function Particle(x,y,alpha=1, scale=1) {
    const p = {
        x:x,
        y:y,
        color:'white',
  
        alpha:alpha,
        scale:scale,
        remove:false,

        update: function() {
            if (this.alpha >= .01) {
                this.alpha -= .004
                this.scale += .02

                this.y -= Math.random() * 2
            }
            else{
                this.remove = true;
            }
        },

        render: function(context, offset) {
            context.setTransform(1, 0, 0, 1, this.x, this.y); 
            context.globalAlpha = this.alpha;
            context.translate(-offset.x, -offset.y);
            //context.translate(-400, -200);
            context.drawImage(img, -img.width * this.scale /2, -img.height* this.scale/2, img.width * this.scale, img.height * this.scale)

            context.setTransform(1,0,0,1,0,0); 

        }
    }

    return p;
}

export default Particle