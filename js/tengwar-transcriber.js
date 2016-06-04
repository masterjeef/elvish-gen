/**
 * Created by Jeff on 5/17/2016.
 */

var tengwarTranscriber = tengwarTranscriber || {};

(function(tt){

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constants/Lookups
    // These map to the unicode values of the characters in the font family
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var alphabet = {
        vowels : {
            'a' : '&#35;',
            'e' : '&#36;',
            'i' : '&#37;',
            'o' : '&#94;',
            'u' : '&#38;',
            'y' : '&#204;'
        },
        doubleVowels : {
            'aa' : '&#35;' + '&#67;',
            'ee' : '&#36;' + '&#70;',
            'ii' : '&#37;' + '&#66;',
            'oo' : '&#94;' + '&#78;',
            'uu' : '&#38;' + '&#74;',
            'yy' : '&#204;' + '&#206;'
        },
        consonants : {
            'b' : '&#119;',
            'c' : '&#97;',
            'd' : '&#50;',
            'f' : '&#101;',
            'g' : '&#120;',
            'h' : '', // ???
            'j' : '&#83;',
            'k' : '&#122;',
            'l' : '&#106;',
            'm' : '&#116;',
            'n' : '&#53;',
            'p' : '&#113;',
            'q' : '', // there is no 'q' equivalent in Tengwar (see qu below)
            'r' : '&#55;', // as in "red"
            //'r' : '&#54;', // as in "car"
            's' : '&#42;', // 2nd form of s
            't' : '&#49;',
            'v' : '&#114;',
            'w' : '&#110;',
            'x' : '', // ???
            //'y' : '&#104;', // y consonant
            'z' : '&#75;'
            //'z' : '&#44;'
        },
        doubleConsonants : {
            'bb' : '&#119;' + '&#58;',
            'cc' : '&#97;' + '&#58;',
            'dd' : '&#50;' + '&#58;',
            'ff' : '&#101;' + '&#58;',
            'gg' : '&#120;' + '&#58;',
            'hh' : '',
            'jj' : '&#83;' + '&#58;',
            'kk' : '&#122;' + '&#58;',
            'll' : '&#106;' + '&#58;',
            'mm' : '&#116;' + '&#58;',
            'nn' : '&#53;' + '&#58;',
            'pp' : '&#113;' + '&#58;',
            'qq' : '',
            'rr' : '&#55;' + '&#58;',
            'ss' : '&#42;' + '&#58;',
            'tt' : '&#49;' + '&#58;',
            'vv' : '&#114;' + '&#58;',
            'ww' : '&#110;' + '&#58;',
            'xx' : '',
            'zz' : '&#75;' + '&#58;'
        },
        // This is what's considered the supplementary alphabet in Tengwar
        supplementary : {
            'ld' : '&#109;',
            'rd' : '&#117;',
            'th' : '&#51;',
            'ch' : '&#99;',
            'sh' : '&#100;',
            'nt' : '&#49;&#123;',
            'nd' : '', // ???
            'mp' : '&#113;&#112;',
            'mb' : '&#119;&#80;',
            'qu' : '&#118;'
        },
        punctuation : {
            ' ' : ' ',
            '.' : '&#8208;',
            ',' : '&#183;',
            '(' : '&#8250;',
            ')' : '&#8250;',
            '\"' : '&#171;',
            '=' : '&#172;',
            '?' : '&#192;',
            '!' : '&#193;'
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Common Namespace
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    tt.Common = {};

    tt.Common.isVowel = function (value){
            return alphabet.vowels[value];
    };

    tt.Common.isSupplementary = function(value) {
        return alphabet.supplementary[value];
    };

    tt.Common.truncateFront = function (value, amountToRemove){
        return value.substring(amountToRemove, value.length);
    };

    tt.Common.take = function (value, numberOfCharacters) {
        return value.substring(0, numberOfCharacters);
    };

    tt.Common.first = function (value) {
        return value.charAt(0);
    };

    tt.Common.isDouble = function (value, character) {
        if(value.length !== 2) {
            return false;
        }

        var first = value.charAt(0),
            second = value.charAt(1);

        if(character) {
            return first === character && second === character;
        }

        return first === second;
    };

    tt.Common.isConsonant = function (value) {
        return alphabet.consonants[value];
    };

    tt.Common.isDoubleConsonant = function (value) {
        return alphabet.doubleConsonants[value];
    };

    tt.Common.isDoubleVowel = function (value) {
        return alphabet.doubleVowels[value];
    };

    tt.toQuenya = function(text)
    {
        var value = text.toLowerCase();
        var quenyaParser = new QuenyaParser(value);
        var nodes = quenyaParser.parseText();
        nodes.print();
        return nodes.toQuenya();
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ElvishNode
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function ElvishNode(top, middle, bottom, nextNode) {
        this.top = top || '';
        this.middle = middle || '';
        this.bottom = bottom || '';
        this.nextNode = nextNode;
    }

    ElvishNode.prototype.totalLetterCount = function() {
        return this.top.length + this.middle.length + this.bottom.length;
    };

    ElvishNode.prototype.print = function () {
        console.log((this.top || '-') + '|' + (this.middle || '-') + '|' + (this.bottom || '-'));
        if(this.nextNode) {
            this.nextNode.print();
        }
    };

    ElvishNode.prototype.toQuenya = function () {
        var result = '';

        if(this.middle.length > 0) {
            result += alphabet.consonants[this.middle] ||
                alphabet.doubleConsonants[this.middle] ||
                alphabet.supplementary[this.middle] ||
                alphabet.punctuation[this.middle] ||
                this.middle;
        }

        if(this.bottom.length > 0) {
            result += alphabet.vowels[this.bottom] || alphabet.doubleVowels[this.bottom];
        }

        if(this.top.length > 0){
            result += alphabet.vowels[this.top] || alphabet.doubleVowels[this.top];
        }

        if(this.nextNode) {
            result += this.nextNode.toQuenya();
        }

        return result;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ElvishNodeParser
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function ElvishNodeParser(text) {
        this.text = text;
    }

    ElvishNodeParser.prototype.parseText = function () {
        return this.parse(this.text);
    };

    ElvishNodeParser.prototype.parse = function (characters) {
        // base case
        if(!characters || characters.length === 0){
            return undefined;
        }

        var node = new ElvishNode();

        this.fillNode(node, characters);

        // unrecognized character... just stick it in the middle and continue
        if (node.totalLetterCount() === 0){
            node.middle = tt.Common.first(characters)
        }

        var remaining = tt.Common.truncateFront(characters, node.totalLetterCount());

        node.nextNode = this.parse(remaining);

        return node;
    };

    ElvishNodeParser.prototype.fillNode = function(node, remainingCharacters) {
        var first = tt.Common.first(remainingCharacters);
        node.middle = first;
        return node;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // QuenyaParser
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function QuenyaParser(text) {
        QuenyaParser.prototype.constructor.call(this, text);
    }

    QuenyaParser.prototype = new ElvishNodeParser();

    QuenyaParser.prototype.fillNode = function(node, remainingCharacters) {
        var remaining = remainingCharacters;

        remaining = this.tryFillMiddle(node, remaining);

        remaining = this.tryFillBottom(node, remaining);

        this.tryFillTop(node, remaining);

        return node;
    };

    QuenyaParser.prototype.tryFillMiddle = function(node, characters){
        // middle section
        // consonant || double consonant || supplementary
        var firstTwo = tt.Common.take(characters, 2),
            first = tt.Common.first(characters);

        // TODO: need to handle the two variations of r...
        // TODO: figure out if 'y' is a consonant

        if(tt.Common.isDoubleConsonant(firstTwo) || tt.Common.isSupplementary(firstTwo)) {
            node.middle = firstTwo;
        } else if (tt.Common.isConsonant(first)) {
            node.middle = first;
        }

        return tt.Common.truncateFront(characters, node.middle.length);
    };

    QuenyaParser.prototype.tryFillBottom = function(node, characters) {
        // bottom section
        // 'y' || silent 'e' || double 'y' || double 'e'
        var firstTwo = tt.Common.take(characters, 2),
            first = tt.Common.first(characters);

        // TODO : find a more reliable way to determine silent e
        var isSilentE = !tt.Common.isDouble(firstTwo) && characters.length === 1 && first === 'e';

        if(tt.Common.isDouble(firstTwo, 'e') || tt.Common.isDouble(firstTwo, 'y')){
            node.bottom = firstTwo;
        } else if(isSilentE || first === 'y') {
            node.bottom = first;
        }

        return tt.Common.truncateFront(characters, node.bottom.length);
    };

    QuenyaParser.prototype.tryFillTop = function(node, characters) {
        // top section
        // vowel || double vowel
        var firstTwo = tt.Common.take(characters, 2),
            first = tt.Common.first(characters);

        if(tt.Common.isDoubleVowel(firstTwo)) {
            node.top = firstTwo;
        } else if(tt.Common.isVowel(first)) {
            node.top = first;
        }

        return tt.Common.truncateFront(characters, node.top.length);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // The rest is temporary, have not wired up the UI
    // This simply demonstrates usage
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var text = 'sheldon';

    var quenyaParser = new QuenyaParser(text);
    var nodes = quenyaParser.parseText();
    nodes.print();
    console.log(nodes.toQuenya());

    var genericParser = new ElvishNodeParser(text);
    nodes = genericParser.parseText();
    nodes.print();

})(tengwarTranscriber);