import { AngularFirestore } from '@angular/fire/firestore';
export function convertSnaps<T>(snaps) {
  return <T[]>snaps.map(snap => {
    return {
      id: snap.payload.doc.id,
      ...snap.payload.doc.data()
    };
  });
}

export function dbFieldUpdate(
  docPath: string,
  fieldName: string,
  newValue: any,
  db: AngularFirestore
) {
  if (docPath && fieldName) {
    console.log("dbFieldUpdate: ", docPath ,fieldName, newValue );
    let updateObject = {};
    updateObject[fieldName] = newValue;
    // console.log(updateObject);
    db.doc(docPath)
      .update(updateObject)
      .then(data => {
        // console.log(fieldName + " updated");
      })
      .catch(error => console.log(docPath + ":" + fieldName + " update error ", error));
  }
}
