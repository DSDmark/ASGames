const { log } = console;
const { random, floor } = Math;

class Perceptron {
  constructor(width, height, bgColor, borderSize, borderColor) {
    // Creating canvas config
    this.canvas = document.getElementById("cvs");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.style.border = `${borderSize} solid ${borderColor}`;
    this.CW = this.canvas.width = width;
    this.CH = this.canvas.height = height;
    this.canvas.style.background = bgColor;

    // Initialing weights of input randomly
    this.min = -1;
    this.max = 1;
    this.weights = [2, 3];
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] = random() * (this.max - this.min + 1) + 1;
    }
  }
  // Activation function
  sign(n) {
    if (n > 0) return +1;
    else return -1;
  }

  // compute weights and it's corresponding input 
  // w1 * x1 + w2 * x1....
  guess(ipt) {
    let sum = 0;
    let output = 0;
    for (let i = 0; i < this.weights.length; i++) {
      sum += ipt[i] * this.weights[i];
      log(sum)
    }
    output = this.sign(sum);
    return output;
  }
}

class DataSet{

}

// const p = new Perceptron(400, 400, "grey", "3px", "white");
// log(p);
// log(p.guess([-1,.5]))

