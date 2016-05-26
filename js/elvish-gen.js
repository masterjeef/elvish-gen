/**
 * Created by Jeff on 5/17/2016.
 */

var elvishGenerator = elvishGenerator || {};

(function(eg){

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constants/Lookups
    // Eventually these will map to image paths
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var alphabet = {
        vowels : {
            'a' : 'a',
            'e' : 'e',
            'i' : 'i',
            'o' : 'o',
            'u' : 'u',
            'y' : 'y'
        },
        consonants : {
            'b' : 'b',
            'c' : 'c',
            'd' : 'd',
            'f' : 'f',
            'g' : 'g',
            'h' : 'h',
            'j' : 'j',
            'k' : 'k',
            'l' : 'l',
            'm' : 'm',
            'n' : 'n',
            'p' : 'p',
            'q' : 'q',
            'r' : 'r',
            's' : 's',
            't' : 't',
            'u' : 'u',
            'v' : 'v',
            'w' : 'w',
            'x' : 'x',
            'z' : 'z'
        },
        // This is what's considered the supplementary alphabet in Elvish
        supplementary : {
            'ld' : 'ld',
            'rd' : 'rd',
            'th' : 'th',
            'ch' : 'ch',
            'sh' : 'sh',
            'nt' : 'nt',
            'nd' : 'nd',
            'mp' : 'mp',
            'mb' : 'mb'
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Common Namespace
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    eg.Common = {};

    eg.Common.isVowel = function (value){
            return alphabet.vowels[value];
    };

    eg.Common.isSupplementary = function(value) {
        return alphabet.supplementary[value];
    };

    eg.Common.truncateFront = function (value, amountToRemove){
        return value.substring(amountToRemove, value.length);
    };

    eg.Common.take = function (value, numberOfCharacters) {
        return value.substring(0, numberOfCharacters);
    };

    eg.Common.first = function (value) {
        return value.charAt(0);
    };

    eg.Common.isDouble = function (value, character) {
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

    eg.Common.isConsonant = function (value) {
        return alphabet.consonants[value];
    };

    eg.Common.isDoubleConsonant = function (value) {
        return eg.Common.isDouble(value) && eg.Common.isConsonant(eg.Common.first(value));
    };

    eg.Common.isDoubleVowel = function (value) {
        return eg.Common.isDouble(value) && eg.Common.isVowel(eg.Common.first(value));
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
            node.middle = eg.Common.first(characters)
        }

        var remaining = eg.Common.truncateFront(characters, node.totalLetterCount());

        node.nextNode = this.parse(remaining);

        return node;
    };

    ElvishNodeParser.prototype.fillNode = function(node, remainingCharacters) {
        var first = eg.Common.first(remainingCharacters);
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
        var firstTwo = eg.Common.take(characters, 2),
            first = eg.Common.first(characters);

        // TODO: need to handle the two variations of r...
        // TODO: figure out if 'y' is a consonant

        if(eg.Common.isDoubleConsonant(firstTwo) || eg.Common.isSupplementary(firstTwo)) {
            node.middle = firstTwo;
        } else if (eg.Common.isConsonant(first)) {
            node.middle = first;
        }

        return eg.Common.truncateFront(characters, node.middle.length);
    };

    QuenyaParser.prototype.tryFillBottom = function(node, characters) {
        // bottom section
        // 'y' || silent 'e' || double 'y' || double 'e'
        var firstTwo = eg.Common.take(characters, 2),
            first = eg.Common.first(characters);

        // TODO : find a more reliable way to determine silent e
        var isSilentE = !eg.Common.isDouble(firstTwo) && characters.length === 1 && first === 'e';

        if(eg.Common.isDouble(firstTwo, 'e') || eg.Common.isDouble(firstTwo, 'y')){
            node.bottom = firstTwo;
        } else if(isSilentE || first === 'y') {
            node.bottom = first;
        }

        return eg.Common.truncateFront(characters, node.bottom.length);
    };

    QuenyaParser.prototype.tryFillTop = function(node, characters) {
        // top section
        // vowel || double vowel
        var firstTwo = eg.Common.take(characters, 2),
            first = eg.Common.first(characters);

        if(eg.Common.isDoubleVowel(firstTwo)) {
            node.top = firstTwo;
        } else if(eg.Common.isVowel(first)) {
            node.top = first;
        }

        return eg.Common.truncateFront(characters, node.top.length);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // The rest is temporary, have not wired up the UI
    // This simply demonstrates usage
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var text = 'sheldon';

    var quenyaParser = new QuenyaParser(text);
    var nodes = quenyaParser.parseText();
    nodes.print();

    var genericParser = new ElvishNodeParser(text);
    nodes = genericParser.parseText();
    nodes.print();

})(elvishGenerator);