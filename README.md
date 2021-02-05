# markdown-it-replace-it

This [markdown-it](https://github.com/markdown-it/markdown-it) plugin replaces the
"[replacements](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js)"
feature in markdown-it typographer, allowing you to customize the replacement rules
(regular expression substitutions) done to inline text outside of autolinks.
The replacement text can also be interpreted as HTML.

There are four built-in replacement rules (mimicking some of the built-in
markdown-it typographer):

* `+-` &rarr; ± (rule "plusminus")
* `...` &rarr; … (rule "ellipsis")
* `---` &rarr; &mdash; (rule "mdash")
* `--` &rarr; &ndash; (rule "ndash")

Each rule can be turned off by specifying an option object when using the
module (mapping each undesired rule name to `false`). Additional rules can be
added by modifying the `replacements` module attribute. This is an array of
rules, where each `rule` has:

* a name `rule.name`
* a regular expression `rule.re` pattern for searching the text to be replaced
* a substitution `rule.sub` that replaces the text matching the regular expression pattern. This can be either a string value or a function.
* a flag `rule.html` (default 'false') that instructs the renderer that the returned string is HTML
* a flag `rule.default` (default 'true') controlling if this rule is enabled

## Sample Usage

### Without smart quotes

```javascript
md = require('markdown-it')()
.use(require('markdown-it-replacements'));
md.renderInline('Hello... "world"---');

// returning -> 'Hello… &quot;world&quot;—'
```

### With smart quotes

```javascript
md = require('markdown-it')({typographer: true})
.use(require('markdown-it-replacements'));
md.renderInline('Hello... "world"---');

// returning -> 'Hello… “world”—'
```

### Using options to turn specific replacements on/off

```javascript
md = require('markdown-it')({typographer: true})
.use(require('markdown-it-replacements'), {mdash: false});
md.renderInline('Hello... "world"---');

// returning -> 'Hello… “world”---'
```

### Adding custom replacements

```javascript
mir = require('markdown-it-replacements');
mir.replacements.push({
  name: 'allcaps',
  re: /[a-z]/g,
  sub: function (s) { return s.toUpperCase(); },
  default: true
});
md = require('markdown-it')({typographer: true}).use(mir);
md.renderInline('Hello... "world"---');

// returning -> 'HELLO… “WORLD”—'
```

### Adding custom replacements with support for inline HTML

```javascript
mir = require('markdown-it-replacements');
mir.replacements.push({
  name: 'allcaps',
  re: /[a-z]/g,
  html: true,
  sub: function (s) { return '<span>' + s.toUpperCase() + '</span>'; },
  default: true
});
md = require('markdown-it')({typographer: true}).use(mir);
md.renderInline('Hello... "world"---');

// returning -> '<span>HELLO</span>… “<span>WORLD</span>”—'
```

## Notes

* Unlike the built-in replacements rule, this module does not require
  the global `typographer` option to be set to true.  (The reasoning being
  that, if you're using this module, you probably want to do the
  substitutions.)  This means that the `typographer` option effectively
  controls whether to do smart-quote substitution.
* This module was built on top the the [markdown-it-replacements](https://github.com/edemaine/markdown-it-replacements) and:
  * upgraded the dependencies
  * returned to plain JavaScript (instead of [CoffeeScript](https://insights.dice.com/2020/02/03/5-programming-languages-you-wont-use-2030/))
  * adding the inline HTML support
  * propagating the parser state environment to the substitution function. This environment is used by some frameworks or modules (like [11ty](https://github.com/11ty/eleventy)) to provide dynamic values during the markdown conversion.
