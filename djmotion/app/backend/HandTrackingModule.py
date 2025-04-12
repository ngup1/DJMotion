import cv2
import mediapipe as mp
import time
import math

class handDetector():
    def __init__(self, mode= False, maxHands=2, detectionCon=0.5, trackCon=0.5): #detectionCon = detection confidence, trackCon = tracking confidence
        self.mode = mode
        self.maxHands = maxHands
        self.detectionCon = detectionCon
        self.trackCon = trackCon

        self.mpHands = mp.solutions.hands
        self.hands = self.mpHands.Hands(self.mode, self.maxHands, self.detectionCon, self.trackCon)