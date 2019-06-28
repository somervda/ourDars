export function convertSnaps<T>(snaps) {
  return <T[]>snaps.map(snap => {
    return {
      id: snap.payload.doc.id,
      ...snap.payload.doc.data()
    };
  });
}

export function dbFieldUpdate(
  collectionName: string,
  docId: string,
  fieldName: string,
  newValue: any
) {
  if (docId && fieldName) {
    console.log(fieldName + " before Update", docId, newValue);
    let updateObject = {};
    updateObject[fieldName] = newValue;
    console.log(updateObject);
    db.doc("/checklistItems/" + docId)
      .update(updateObject)
      .then(data => {
        console.log(fieldName + " updated");
      })
      .catch(error => console.log(fieldName + " update error ", error));
  }
}
