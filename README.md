ember-rdfa-editor-date-manipulation-plugin
==============================================================================

plugin responsible for automatically manipulating a date according to an RDFA instructive .


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install @lblod/ember-rdfa-editor-date-manipulation-plugin
```


Usage
------------------------------------------------------------------------------
An instructive is an RDFA snippet you insert in your template.

Currently the following snippet should be inserted:
```
<span property="a:specificProperty" datatype="xsd:date" content="">
  <span typeOf="ext:currentDate">&nbsp;</span>
</span>
```
and will result, once triggered by the eventProcessor, in:
```
<span property="a:specificProperty" datatype="xsd:date" content="2018-09-17">
  17 september 2018
</span>
```

The text value of the span is moment.js long format date, localized.
The config of moment.js should be provided by the parent app, in the config/environment.js:

```
let ENV = {
    moment: {
      includeLocales: ['nl'],
  }
}
```

If used in `datatype="xsd:dateTime"`, current datetime  will be set.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
