if (this.position.x + (bridPro / 2) >= x) {
      if (this.position.x + bridPro < x + pipeW) {
        if (this.position.y - bridPro <= pipeH) {
          if ((bridPro / 2) + this.position.y >= pipeH) {
            console.info("he");
            player.gamePlaying = false;
        }
        }
      }
    }