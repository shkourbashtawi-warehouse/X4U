let replacements = [
  [/\*/g, '\\*', 'asterisks'],
  [/#/g, '\\#', 'number signs'],
  [/\//g, '\\/', 'slashes'],
  [/\(/g, '\\(', 'parentheses'],
  [/\)/g, '\\)', 'parentheses'],
  [/\[/g, '\\[', 'square brackets'],
  [/\]/g, '\\]', 'square brackets'],
  [/</g, '&lt;', 'angle brackets'],
  [/>/g, '&gt;', 'angle brackets'],
  [/_/g, '\\_', 'underscores'],
];

module.exports = function (string, skips) {
  skips = skips || [];
  return replacements.reduce(function (string, replacement) {
    let name = replacement[2];
    return name && skips.indexOf(name) !== -1 ? string : string.replace(replacement[0], replacement[1]);
  }, string);
};

/*
escape("#1! We're #1!")       => '\\#1! We're \\#1!'
escape("http://example.com")  => 'http:\\/\\/example.com'
escape('one (1)')             => 'one \\(1\\)'

#Skip escaping specific characters.
escape('one (1)', ['parentheses'])         => 'one (1)'
escape("http://example.com", ['slashes'])  => 'http://example.com'
*/
