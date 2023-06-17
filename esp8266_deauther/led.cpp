/* This software is licensed under the MIT License: https://github.com/spacehuhntech/esp8266_deauther */

#include "led.h"

#include "A_config.h" // Config for LEDs
#include <Arduino.h>  // digitalWrite, analogWrite, pinMode
#include "language.h" // Strings used in printColor and tempDisable
#include "settings.h" // used in update()
#include "Attack.h"   // used in update()
#include "Scan.h"     // used in update()

// define led pins
#define LED_R 12
#define LED_G 13
#define LED_B 14



extern Attack attack;
extern Scan   scan;

namespace led {
    // ===== PRIVATE ===== //
    LED_MODE mode = OFF;

    void setColor(uint8_t r, uint8_t g, uint8_t b) {
      analogWrite(LED_R, r);
      analogWrite(LED_G, g);
      analogWrite(LED_B, b);
    }

    // ===== PUBLIC ===== //
    void setup() {
        pinMode(LED_R, OUTPUT);
        pinMode(LED_G, OUTPUT);
        pinMode(LED_B, OUTPUT);

        // test the led
        analogWrite(LED_R, 255);
        delay(200);
        analogWrite(LED_R, 0);
        
        analogWrite(LED_G, 255);
        delay(200);
        analogWrite(LED_G, 0);
        
        analogWrite(LED_B, 255);
        delay(200);
        analogWrite(LED_B, 0);
    }
    
    void update() {
        //setMode(OFF);
        if (scan.isScanning() && (scan.deauths < settings::getSnifferSettings().min_deauth_frames)) {
            setMode(SCAN);
        } else if (attack.isRunning()) {
            setMode(ATTACK);
        } else {
            setMode(IDLE);
        }
    }

    void setMode(LED_MODE new_mode, bool force) {
        if ((new_mode != mode) || force) {
            mode = new_mode;

            switch (mode) {
                case OFF:
                    setColor(LED_MODE_OFF);
                    break;
                case SCAN:
                    setColor(LED_MODE_SCAN);
                    break;
                case ATTACK:
                    setColor(LED_MODE_ATTACK);
                    break;
                case IDLE:
                    setColor(LED_MODE_IDLE);
                    break;
            }
        }
    }
}
