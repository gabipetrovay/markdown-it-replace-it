// These regular expressions are based on
// https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
// (also distributed under MIT License)

var replacements = [
    {
        name: 'plusminus',
        re: /\+-/g,
        sub: '\u00b1',
        default: true
    },
    {
        name: 'ellipsis',
        re: /\.\.\./g,
        sub: '\u2026',
        default: true
    },
    {
        name: 'mdash',
        re: /(^|[^-])---([^-]|$)/mg,
        sub: '$1\u2014$2',
        default: true
    },
    {
        name: 'ndash',
        re: /(^|[^-])--([^-]|$)/mg,
        sub: '$1\u2013$2',
        default: true
    },
    {
        name: 'ndash',
        re: /(^|[^-\s])--([^-\s]|$)/mg,
        sub: '$1\u2013$2',
        default: true
    }
];

module.exports = function(md, options) {
    if (options == null) {
        options = {};
    }
    md.core.ruler.at('replacements', function(state) {
        var block, i, inside_autolink, j, k, l, len, len1, len2, m, n, o, ref, ref1, ref2, ref3, ref4, ref5, replacement, results, results1, token;
        ref1 = (function() {
            results = [];
            for (var l = 0, ref = state.tokens.length; 0 <= ref ? l < ref : l > ref; 0 <= ref ? l++ : l--){ results.push(l); }
            return results;
        }).apply(this).reverse();
        for (k = 0, len = ref1.length; k < len; k++) {
            i = ref1[k];
            block = state.tokens[i];
            if (block.type !== 'inline') {
                continue;
            }
            inside_autolink = 0;
            ref3 = (function() {
                results1 = [];
                for (var n = 0, ref2 = block.children.length; 0 <= ref2 ? n < ref2 : n > ref2; 0 <= ref2 ? n++ : n--){ results1.push(n); }
                return results1;
            }).apply(this).reverse();
            for (m = 0, len1 = ref3.length; m < len1; m++) {
                j = ref3[m];
                token = block.children[j];
                switch (token.type) {
                    case 'link_open':
                        if (token.info === 'auto') {
                            inside_autolink -= 1;
                        }
                        break;
                    case 'link_close':
                        if (token.info === 'auto') {
                            inside_autolink += 1;
                        }
                        break;
                    case 'text':
                        if (inside_autolink) {
                            break;
                        }
                        for (o = 0, len2 = replacements.length; o < len2; o++) {
                            replacement = replacements[o];
                            if ((ref4 = (ref5 = options[replacement.name]) != null ? ref5 : replacement.default) != null ? ref4 : true) {
                                var replacer = replacement.sub;
                                if (typeof replacement.sub === 'function') {
                                    replacer = (s => replacement.sub(s, state.env));
                                }
                                token.content = token.content.replace(replacement.re, replacer);
                                token.type = replacement.html ? 'html_inline' : 'text';
                            }
                        }
                }
            }
        }
        return null;
    });
    return null;
};


// Export replacements array so that user can add their own rules.
// For example: require('markdown-it-replacements').replacements.push({...})
module.exports.replacements = replacements;
