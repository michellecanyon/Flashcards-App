import { Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import * as Permissions from 'expo-permissions';

const FLASHCARDS_NOTIF_KEY = 'UdaciFlashcards:notifications';

function createNotif() {
  return {
    title: "Reminder: You haven't studied today!",
    body: "Don't forget to complete a quiz today!",
    ios: {
      sound: true
    },
    android: {
      sound: true,
      priority: 'high',
      sticky: false,
      vibrate: true,
    }
  }
}

export function clearNotif () {
  return AsyncStorage.removeItem(FLASHCARDS_NOTIF_KEY)
    .then(Notifications.cancelAllScheduledNotificationsAsync)
}

export function setNotif () {
  AsyncStorage.getItem(FLASHCARDS_NOTIF_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS)
          .then(({ status }) => {
            if (status === 'granted') {
              Notifications.cancelAllScheduledNotificationsAsync()

              let tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              tomorrow.setHours(20)

              Notifications.scheduleLocalNotificationAsync(
                createNotif(),
                {
                  time: tomorrow,
                  repeat: 'day',
                }
              )

              AsyncStorage.setItem(FLASHCARDS_NOTIF_KEY, JSON.stringify(true))
            }
          })
      }
    })
}
