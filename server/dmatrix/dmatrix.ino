#include <Adafruit_LEDBackpack.h>
#include <Arduino.h>
#include <string.h>

Adafruit_BicolorMatrix matrix = Adafruit_BicolorMatrix();

const uint16_t bitmap[8][8] = {
{3, 3, 2, 2, 1, 1, 3, 3, },
{3, 3, 2, 2, 1, 1, 3, 3, },
{2, 2, 1, 1, 1, 1, 1, 1, },
{2, 2, 1, 1, 1, 1, 1, 1, },
{1, 1, 2, 2, 1, 1, 3, 3, },
{1, 1, 2, 2, 2, 2, 3, 3, },
{3, 3, 1, 1, 2, 2, 1, 1, },
{3, 3, 1, 1, 2, 2, 1, 1, },
};

void displayBitmap(const uint16_t bit[8][8]){
  for (int i=0; i<8; i++)
    for (int j=0; j<8; j++)
      matrix.drawPixel(i, j, bit[j][i]);
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
