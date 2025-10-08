#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function pointer(p) {
  return '/' + p.map(x => String(x)).join('/');
}

function flatten(obj, currentPath = []) {
  const result = {};

  for (const key in obj) {
    const value = obj[key];
    const newPath = [...currentPath, key];

    if (value === null || typeof value !== 'object') {
      result[pointer(newPath)] = value;
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayPath = [...newPath, index];
        if (item === null || typeof item !== 'object') {
          result[pointer(arrayPath)] = item;
        } else {
          Object.assign(result, flatten(item, arrayPath));
        }
      });
    } else {
      Object.assign(result, flatten(value, newPath));
    }
  }

  return result;
}

function scope(o, withVariants) {
  const prod = o.response ? o.response.products[0] : o.products[0];
  if (withVariants) {
    return prod;
  } else {
    const { variants, ...rest } = prod;
    return rest;
  }
}

function compare(beforeFile, afterFile, withVariants = false) {
  const before = JSON.parse(fs.readFileSync(beforeFile, 'utf8'));
  const after = JSON.parse(fs.readFileSync(afterFile, 'utf8'));

  const B = scope(before, withVariants);
  const A = scope(after, withVariants);

  const BM = flatten(B);
  const AM = flatten(A);

  const beforeKeys = new Set(Object.keys(BM));
  const afterKeys = new Set(Object.keys(AM));

  const addedKeys = [...afterKeys].filter(k => !beforeKeys.has(k)).sort();
  const removedKeys = [...beforeKeys].filter(k => !afterKeys.has(k)).sort();
  const changedKeys = [...afterKeys]
    .filter(k => beforeKeys.has(k) && BM[k] !== AM[k])
    .sort();

  console.log('=== ADDED ===');
  if (addedKeys.length === 0) {
    console.log('(none)');
  } else {
    addedKeys.forEach(k => {
      console.log(`${k}: ${JSON.stringify(AM[k])}`);
    });
  }

  console.log('');
  console.log('=== REMOVED ===');
  if (removedKeys.length === 0) {
    console.log('(none)');
  } else {
    removedKeys.forEach(k => {
      console.log(`${k}: ${JSON.stringify(BM[k])}`);
    });
  }

  console.log('');
  console.log('=== CHANGED ===');
  if (changedKeys.length === 0) {
    console.log('(none)');
  } else {
    changedKeys.forEach(k => {
      console.log(`${k}: ${JSON.stringify(BM[k])}  =>  ${JSON.stringify(AM[k])}`);
    });
  }
}

// Main
if (process.argv.length < 4) {
  console.log('Usage: node compare_product_json.js BEFORE.json AFTER.json [--with-variants]');
  process.exit(1);
}

const beforeFile = process.argv[2];
const afterFile = process.argv[3];
const withVariants = process.argv[4] === '--with-variants';

compare(beforeFile, afterFile, withVariants);
