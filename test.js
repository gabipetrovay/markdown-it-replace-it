const assert = require('assert');
const markdownIt = require('markdown-it');

var markdownItReplacements = require('.');

var test = function(text, options, typographer) {
    var md;
    if (typographer == null) {
        typographer = true;
    }
    md = markdownIt({
        typographer: typographer
    }).use(markdownItReplacements, options);

    return md.renderInline(text);
};

describe('markdown-it-replacements', function() {
    it('blank values', function() {
        return assert.equal('', test(''));
    });
    it('override (c) replacement behavior', function() {
        return assert.equal('(c)', test('(c)'));
    });
    it('ndash', function() {
        return assert.equal('1\u20139', test('1--9'));
    });
    it('mdash', function() {
        return assert.equal('yes\u2014or no', test('yes---or no'));
    });
    it('ellipsis', function() {
        return assert.equal('yes\u2026', test('yes...'));
    });
    it('plus minus', function() {
        return assert.equal('1 \u00b1 100', test('1 +- 100'));
    });
    it('override ndash', function() {
        return assert.equal('1--9', test('1--9', {
            ndash: false
        }));
    });
    it('override mdash', function() {
        return assert.equal('yes---or no', test('yes---or no', {
            mdash: false
        }));
    });
    it('override ellipsis', function() {
        return assert.equal('yes...', test('yes...', {
            ellipsis: false
        }));
    });
    it('override plus minus', function() {
        return assert.equal('1 +- 100', test('1 +- 100', {
            plusminus: false
        }));
    });
    it('runs even with typographer set to false', function() {
        return assert.equal('1\u20139', test('1--9', {}, false));
    });
    it('custom replacement, no default', function() {
        markdownItReplacements.replacements.push({
            name: 'allcaps',
            re: /[a-z]/g,
            sub: function(s) {
                return s.toUpperCase();
            }
        });
        return assert.equal('HELLO', test('hello'));
    });
    it('custom replacement, default true', function() {
        markdownItReplacements.replacements[markdownItReplacements.replacements.length - 1]['default'] = true;
        return assert.equal('HELLO', test('hello'));
    });
    it('custom replacement, default false', function() {
        markdownItReplacements.replacements[markdownItReplacements.replacements.length - 1]['default'] = false;
        return assert.equal('hello', test('hello'));
    });
    it('custom replacement, html', function() {
        markdownItReplacements.replacements.push({
            name: 'html',
            re: /[a-z]+/g,
            html: true,
            sub: function(s) {
                return `<span>${s.toUpperCase()}</span>`;
            }
        });
        return assert.equal('<span>HELLO</span>', test('hello'));
    });
    it('custom replacement, html false', function() {
        markdownItReplacements.replacements[markdownItReplacements.replacements.length - 1]['html'] = false;
        return assert.equal('&lt;span&gt;HELLO&lt;/span&gt;', test('hello'));
    });

    return;
});
