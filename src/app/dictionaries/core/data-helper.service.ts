import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataHelperService {

  public static availableTransformers = [{
    name: 'entry',
    id: 'entry',
  }, {
    name: 'sense',
    id: 'sense',
  }, {
    name: 'headword',
    id: 'hw',
  }, {
    name: 'definition',
    id: 'def',
  }, {
    name: 'headword translation',
    id: 'hw_tr',
  }, {
    name: 'entry language',
    id: 'entry_lang',
  }, {
    name: 'headword translation language',
    id: 'hw_tr_lang',
  }, {
    name: 'example',
    id: 'ex',
  }, {
    name: 'example translation',
    id: 'ex_tr',
  }, {
    name: 'example translation language',
    id: 'ex_tr_lang',
  }, {
    name: 'part of speech',
    id: 'pos',
  }, {
    name: 'secondary headword',
    id: 'sec_hw',
  }];

  public static elementList = [
    'entry',
    'sense',
    'def',
    'entry_lang',
    'hw',
    'hw_tr',
    'hw_tr_lang',
    'ex',
    'ex_tr',
    'ex_tr_lang',
    'pos',
    'sec_hw',
  ];

  public static metadata = [
    {
      name: 'bibliographicCitation',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'publisher',
      type: 'text',
    },
    {
      name: 'license',
      type: 'text',
    },
    {
      name: 'created',
      type: 'date',
    },
    {
      name: 'extent',
      type: 'text',
    },
    {
      name: 'identifier',
      type: 'text',
    },
    {
      name: 'source',
      type: 'text',
    },
    {
      name: 'creator',
      type: 'arrayOfObject',
      objects: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Url',
        },
      ],
    },
    {
      name: 'contributor',
      type: 'arrayOfObject',
      objects: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Url',
        },
      ],
    },
  ];

  public static partOfSpeechElementList = [
    'adj',
    'adp',
    'adv',
    'aux',
    'cconj',
    'det',
    'intj',
    'noun',
    'num',
    'part',
    'pron',
    'propn',
    'punct',
    'sconj',
    'sym',
    'verb',
    'x',
  ];


  public constructor() { }

  public static convertArraysInObjectToNull = (object) => {
    Object.keys(object).forEach((k) => {
      if (Array.isArray(object[k]) && object[k].length === 0) {
        object[k] = null;
      }
    });

    return object;
  }

  public static convertDatesInObjectToFormattedString = (object) => {
    Object.keys(object).forEach((k) => {
      if (object[k] instanceof Date) {
        object[k] = `${object[k].getFullYear()}-${object[k].getMonth() + 1}-${object[k].getDate()}`;
      }
    });

    return object;
  }


  public static convertFormattedStringInObjectToDates = (object) => {
    Object.keys(object).forEach((k) => {
      const field = DataHelperService.metadata.find((f) => f.name === k);
      if (field.type === 'date' && object[k]) {
        object[k] = new Date(Date.parse(object[k]));
      }
    });

    return object;
  }

  public static convertNulledArraysInObjectToArray = (object) => {
    Object.keys(object).forEach((k) => {
      // We convert arrays on save to null, because of api transformator handling.
      // Potentially dangerous
      const field = DataHelperService.metadata.find((f) => f.name === k);
      if (field.type === 'arrayOfObject' && object[k] === null) {
        object[k] = [];
      }
    });

    return object;
  }

  public static extractTransformers(transformation) {
    const transformers = [];
    Object.keys(transformation).forEach((k) => {
      if (this.isATransformer(k)) {
        const transformer = {
          id: k,
          name: this.findTransformerNameByShortId(k),
        };
        transformers.push(transformer);
      }
    });

    return transformers;
  }

  public static findTransformerNameByShortId(transformerId) {
    return this.availableTransformers.find(t => t.id === transformerId).name;
  }

  public static getDefaultMetadataArrayItemFields(field) {
    const fieldData = this.metadata.find(o => o.name === field);
    return fieldData.objects.map(o => o.name);
  }

  public static getUnusedPartOfSpeechElements(transformation) {
    const transformer = transformation.pos;

    if (transformer && transformer.xlat) {
      const elements = [];
      this.partOfSpeechElementList.forEach((k) => {
        if (!transformer.xlat[k] && transformer.xlat[k] !== '') {
          const posElement = {
            id: k,
            name: k,
          };
          elements.push(posElement);
        }
      });
      return elements;
    }
  }

  public static getUnusedTransformers(transformation) {
    const transformers = [];
    this.elementList.forEach((k) => {
      if (!transformation[k] || transformation[k].deleted) {
        const transformer = {
          id: k,
          name: this.findTransformerNameByShortId(k),
        };
        transformers.push(transformer);
      }
    });

    return transformers;
  }

  public static isATransformer(elementName: string): boolean {
    return this.elementList.indexOf(elementName) !== -1;
  }

  /**
   * **Designed for "Mirror part of speech object"**
   *
   * pos property in transformation requires structure like shown below
   * {
   *   "userInput": "staticKey"
   * }
   * This structure can not be used in current input binding method so we mirror this object so we can use staticKey as a
   * ngModel bind and userInput as the value of staticKey
   *
   * Results in:
   * {
   *   "staticKey": "userInput"
   * }
   *
   */
  public static mirrorObject(object) {
    const o = {...object};
    Object.keys(object).forEach((k) => {
      o[o[k]] = k;
      delete o[k];
    });

    return o;
  }
}
