/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { LimitedArray, getIndexBelowMax, Bucket } = require('./hash-table-helpers');

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
    // Do not modify anything inside of the constructor
  }

  resize() {
    this.limit *= 2;
    const oldStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    oldStorage.each((bucket) => {
      if (!bucket) return;
      if (bucket.head === null) return;
      while (bucket.head !== null) {
        const head = bucket.removeHead();
        this.insert(head.key, head.value);
      }
    });
  }

  capacityIsFull() {
    let fullCells = 0;
    this.storage.each((bucket) => {
      if (bucket !== undefined) fullCells++;
    });
    return fullCells / this.limit >= 0.75;
  }

  // Adds the given key, value pair to the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // If no bucket has been created for that index, instantiate a new bucket and add the key, value pair to that new bucket
  // If the key already exists in the bucket, the newer value should overwrite the older value associated with that key
  insert(key, value) {
    if (this.capacityIsFull()) this.resize();
    key = key.toString();
    const index = getIndexBelowMax(key, this.limit);
    const bucket = this.storage.get(index) || new Bucket();
    if (bucket.findNode(key, bucket.head) !== undefined) {
      bucket.findNode(key, bucket.head).value = value;
    } else {
      bucket.add(key, value);
    }
    this.storage.set(index, bucket);
  }
  // Removes the key, value pair from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Remove the key, value pair from the bucket
  remove(key) {
    key = key.toString();
    const index = getIndexBelowMax(key, this.limit);
    const bucket = this.storage.get(index);
    if (bucket === undefined) return;
    if (bucket.head === null) return;
    const newBucket = new Bucket();
    while (bucket.head !== null) {
      const head = bucket.removeHead();
      if (head.key !== key) {
        newBucket.add(head.key, head.value);
      }
    }
    this.storage.set(index, newBucket);
  }
  // Fetches the value associated with the given key from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Find the key, value pair inside the bucket and return the value
  retrieve(key) {
    key = key.toString();
    const index = getIndexBelowMax(key, this.limit);
    const bucket = this.storage.get(index);
    let retrieved;
    if (bucket !== undefined) {
      retrieved = bucket.findNode(key, bucket.head);
    }
    return retrieved ? retrieved.value : undefined;
  }
}

module.exports = HashTable;
