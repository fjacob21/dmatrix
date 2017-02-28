/**************************************************************************/
/*!
    @file     dmatrixble.c
    @author   fjacob

    @section LICENSE

    Software License Agreement (BSD License)

    Copyright (c) 2017, Frederic Jacob
    based on Adafruit (adafruit.com) example code
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
    1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
    2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
    3. Neither the name of the copyright holders nor the
    names of its contributors may be used to endorse or promote products
    derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ''AS IS'' AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/**************************************************************************/
#include <Arduino.h>
#include <Adafruit_LEDBackpack.h>
#include <Adafruit_BLE.h>
#include <Adafruit_BluefruitLE_SPI.h>
#include <Adafruit_BluefruitLE_UART.h>"
#include "BluefruitConfig.h"
#include <string.h>
#include <SPI.h>
#if not defined (_VARIANT_ARDUINO_DUE_X_)
  #include <SoftwareSerial.h>
#endif
#include <Wire.h>


// Bi-colors display matrix
Adafruit_BicolorMatrix matrix = Adafruit_BicolorMatrix();


// BLE declarations
Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);

const char* MINIMUM_FIRMWARE_VERSION = "0.7.0";
const int PACKET_BUFFER_LEN          = (2+8*8+1);
const int READ_BUFSIZE               = (PACKET_BUFFER_LEN);

const String BROADCAST_NAME = "Dmatrix display";
const String BROADCAST_CMD = String("AT+GAPDEVNAME=" + BROADCAST_NAME);
uint16_t replyidx = 0;
uint8_t packetbuffer[READ_BUFSIZE+1];


/**************************************************************************/
/*!
    @brief Set the matrix pixels from a pointer when received from the BLE
*/
/**************************************************************************/
void displayBitmap(uint8_t* bmp) 
{
  for (int i=0;i<8;i++)
    for (int j=0;j<8;j++)
      matrix.drawPixel(i,j, bmp[j*8+i]);
}


/**************************************************************************/
/*!
    @brief  Sets up the HW an the BLE module (this function is called
            automatically on startup)
*/
/**************************************************************************/
void setup()
{
  /* Setup serial port */
  Serial.begin(115200);
  Serial.println(F("Bicolor matrix example"));
  Serial.println(F("-----------------------------------------"));

  /* Setup display */
  Serial.println(F("Setup display matrix"));
  matrix.begin(0x71);
  matrix.clear();
  matrix.setRotation(3);
  matrix.writeDisplay();
  
  /* Setup BLE */
  Serial.println(F("Setup BLE"));
  BLEsetup();

  Serial.println( F("Ready") );
}


/**************************************************************************/
/*!
    @brief  Constantly poll for new command or response data
*/
/**************************************************************************/
void loop()
{
  /* We only wait for Bluetooh events */
  ble.update(200);
}


/**************************************************************************/
/*!
    @brief Connection handler callback. Called when when a client connect.
*/
/**************************************************************************/
void connected(void)
{
  Serial.println( F("Connected") );
}


/**************************************************************************/
/*!
    @brief Disconnection handler callback. Called when when a client disconnect.
*/
/**************************************************************************/
void disconnected(void)
{
  Serial.println( F("Disconnected") );
}


/**************************************************************************/
/*!
    @brief Receive data handler callback. Called when receiving data.
*/
/**************************************************************************/
void BleUartRX(char data[], uint16_t len)
{
  for (int i=0; i< len; i++) {
    if (data[i] == '!')
        replyidx = 0;

    packetbuffer[replyidx] = data[i];
    replyidx++;

    if ((packetbuffer[1] == 'D') && (replyidx == PACKET_BUFFER_LEN)) {
      Serial.print(F("Received display buffer: \n"));
      displayBitmap((uint8_t*)packetbuffer+2);
      matrix.writeDisplay();
    }
  }
}


/**************************************************************************/
/*!
    @brief Setup the Bluetooh controller.
*/
/**************************************************************************/
void BLEsetup() 
{
  char buf[60];

  if (!ble.begin(VERBOSE_MODE)) {
    Serial.println( F("Error on ble begin") );
    while(1);
  }
  
  if (!ble.factoryReset()) {
      Serial.println( F("Cannot reset") );
      while(1);
  }

  if (!ble.isVersionAtLeast(MINIMUM_FIRMWARE_VERSION))
    Serial.println( F("Callback requires at least 0.7.0") );
  
  /* Convert the name change command to a char array */
  BROADCAST_CMD.toCharArray(buf, 60);

  /* Change the broadcast device name here! */
  ble.sendCommandCheckOK(buf);
  delay(250);

  //reset to take effect
  ble.sendCommandCheckOK("ATZ");
  delay(250);

  /* Confirm name change */
  ble.sendCommandCheckOK("AT+GAPDEVNAME");

  /* Disable command echo from Bluefruit */
  ble.echo(false);

  /* Print Bluefruit information */
  ble.info();

  ble.verbose(false);

  ble.setConnectCallback(connected);
  ble.setDisconnectCallback(disconnected);
  ble.setBleUartRxCallback(BleUartRX);
  
  /* Set Bluefruit to DATA mode */
  ble.setMode(BLUEFRUIT_MODE_DATA);
}

