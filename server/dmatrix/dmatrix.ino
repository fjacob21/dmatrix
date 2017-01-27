#include <Adafruit_LEDBackpack.h>
#include <string.h>
#include <Arduino.h>

Adafruit_BicolorMatrix matrix = Adafruit_BicolorMatrix();

const uint16_t bitmap[8][8] = {
{0, 0, 3, 3, 3, 3, 0, 0, },
{0, 3, 0, 0, 0, 0, 3, 0, },
{3, 0, 1, 0, 1, 1, 0, 3, },
{3, 0, 0, 1, 1, 0, 0, 3, },
{3, 1, 1, 2, 2, 1, 1, 3, },
{3, 0, 0, 1, 1, 0, 0, 3, },
{0, 3, 1, 0, 0, 1, 3, 0, },
{0, 0, 3, 3, 3, 3, 0, 0, },
};

void displayBitmap(const uint16_t bit[8][8]){
  for (int i=0;i<8;i++){
    for (int j=0;j<8;j++){
    matrix.drawPixel(i,j, bit[j][i]);
    }
  }
}

void setup() {
  matrix.begin(0x71);
  matrix.clear();
  matrix.setRotation(3);
  displayBitmap(bitmap);
  matrix.writeDisplay();

}

void loop() {
  // put your main code here, to run repeatedly:

}
