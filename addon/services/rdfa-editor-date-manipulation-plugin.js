import Service from '@ember/service';
import { task } from 'ember-concurrency';
import moment from 'moment';

/**
 * Service responsible for setting current date/datetime when rdfaInstructive is encountered.
 *
 * ---------------------------------------------------
 * CODE REVIEW NOTES
 * ---------------------------------------------------
 *
 *  INTERACTION PATTERNS
 *  --------------------
 *  For all incoming contexts, first looks whether there is an rdfa instructive to set current date/datetime.
 *  If encountered, the node (and its parent node, specifying whether date or date time should be set), are replaced with current date info.
 *
 *  POTENTIAL ISSUES/TODO
 *  ---------------------
 *  - Danger that if two auto-document-modifying plugins modify the same node or its parent before current plugin executes its behaviour,
 *    the domNode to replace is not attached to domTree anymore and the plugin fails.
 *    (Probably we will encounter these case not only in 'auto' plugins)
 *
 *      TODO: some check if node exists and fallback behaviour (i.e rescan or something) when current plugin is about to replace an unattached node.
 * ---------------------------------------------------
 * END CODE REVIEW NOTES
 * ---------------------------------------------------
 *
 * @module editor-date-manipulation-plugin
 * @class RdfaEditorDateManipulationPlugin
 * @constructor
 * @extends EmberService
 */
const RdfaEditorDateManipulationPlugin = Service.extend({

  /**
   * Restartable task to handle the incoming events from the editor dispatcher
   *
   * @method execute
   *
   * @param {string} hrId Unique identifier of the event in the hintsRegistry
   * @param {Array} contexts RDFa contexts of the text snippets the event applies on
   * @param {Object} hintsRegistry Registry of hints in the editor
   * @param {Object} editor The RDFa editor instance
   *
   * @public
   */
  execute: task(function * (hrId, contexts, hintsRegistry, editor) {
    const location = [ editor.richNode.start, editor.richNode.end ];
    const updatedLocation = hintsRegistry.updateLocationToCurrentIndex(hrId, location);

    const currentDateNodes = editor.selectContext(updatedLocation, {
      scope: "inner",
      datatype : "http://say.data.gift/manipulators/insertion/currentDate"
    });
    const currentDateTimeNodes = editor.selectContext(updatedLocation, {
      scope: "inner",
      datatype : "http://say.data.gift/manipulators/insertion/currentDateTime"
    });

    const currentTime = moment();

    if (!editor.isEmpty(currentDateNodes)) {
      editor.update(currentDateNodes, {
        set: {
          datatype: "xsd:date",
          content: currentTime.format('YYYY-MM-DD'),
          innerHTML: currentTime.format('LL')
        }
      });
    }
    if (!editor.isEmpty(currentDateTimeNodes)) {
      editor.update(currentDateTimeNodes, {
        set: {
          datatype: "xsd:dateTime",
          content: currentTime.toISOString(),
          innerHTML: currentTime.format('LL, LT')
        }
      });
    }
  })
});

RdfaEditorDateManipulationPlugin.reopen({
  who: 'editor-plugins/date-manipulation-card'
});
export default RdfaEditorDateManipulationPlugin;
