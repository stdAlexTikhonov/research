/*global module*/
'use strict';

module.exports = {
    now: () => (new Date).toJSON().replace(/T|[.].+$/g, ' ').trim(),
};
