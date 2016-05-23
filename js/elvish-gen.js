/**
 * Created by Jeff on 5/17/2016.
 */

var elvishGenerator = elvishGenerator || {};

(function(eg){

    // alphabet
    // eventually these will map to image paths, we will see.

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

    // Common Functions (static class)

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

    // Classes

    function ElvishNode(top, middle, bottom, nextNode) {
        this.top = top;
        this.middle = middle;
        this.bottom = bottom;
        this.nextNode = nextNode;
    }

    ElvishNode.prototype.topCount = function () {
        if(this.top) {
            return this.top.length;
        }
        return 0;
    };

    ElvishNode.prototype.middleCount = function() {
        if(this.middle) {
            return this.middle.length;
        }
        return 0;
    };

    ElvishNode.prototype.bottomCount = function () {
        if(this.bottom) {
            return this.bottom.length;
        }
        return 0;
    };

    ElvishNode.prototype.totalLetterCount = function() {
        return this.topCount() + this.middleCount() + this.bottomCount();
    };

    function ElvishNodeParser(text) {
        this.text = text;
    }

    ElvishNodeParser.prototype.parseText = function () {
        return this.parse(this.text);
    };

    ElvishNodeParser.prototype.parse = function(characters) {
        // base case
        if(!characters || characters.length === 0){
            return undefined;
        }

        var node = new ElvishNode();
        var remaining = characters;

        remaining = this.tryFillMiddle(node, remaining);

        remaining = this.tryFillBottom(node, remaining);

        remaining = this.tryFillTop(node, remaining);

        // unrecognized character... just stick it in the middle and continue
        if (node.totalLetterCount() === 0){
            node.middle = remaining.first();
            remaining = remaining.truncateFront(1);
        }

        node.nextNode = this.parse(remaining);

        return node;
    };

    ElvishNodeParser.prototype.tryFillMiddle = function(node, characters){
        // middle section
        // consonant || double consonant || supplementary
        var firstTwo = eg.Common.take(characters, 2),
            first = eg.Common.first(characters);

        if(eg.Common.isDoubleConsonant(firstTwo) || eg.Common.isSupplementary(firstTwo)) {
            node.middle = firstTwo;
        } else if (eg.Common.isConsonant(first)) {
            node.middle = first;
        }

        return eg.Common.truncateFront(characters, node.middleCount());
    };

    ElvishNodeParser.prototype.tryFillBottom = function(node, characters) {
        // bottom section
        // 'y' || silent 'e' || double 'y' || double 'e'
        var firstTwo = eg.Common.take(characters, 2),
            first = eg.Common.first(characters);

        // TODO : find a more reliable way to determine silent e scenario
        var isSilentE = !eg.Common.isDouble(firstTwo) && characters.length === 1 && first === 'e';

        if(eg.Common.isDouble(firstTwo, 'e') || eg.Common.isDouble(firstTwo, 'y')){
            node.bottom = firstTwo;
        } else if(isSilentE || first === 'y') {
            node.bottom = first;
        }

        return eg.Common.truncateFront(characters, node.bottomCount());
    };

    ElvishNodeParser.prototype.tryFillTop = function(node, characters) {
        // top section
        // vowel || double vowel
        var firstTwo = eg.Common.take(characters, 2),
            first = eg.Common.first(characters);

        if(eg.Common.isDoubleVowel(firstTwo)) {
            node.top = firstTwo;
        } else if(eg.Common.isVowel(first)) {
            node.top = first;
        }

        return eg.Common.truncateFront(characters, node.topCount());
    };

    // The rest is temporary, have not wired up the UI
    // This simply demonstrates usage

    var text = 'sheldon';

    var parser = new ElvishNodeParser(text);

    var nodes = parser.parseText();

    var node = nodes;

    while(node) {
        console.log((node.top || '-') + '|' + (node.middle || '-') + '|' + (node.bottom || '-'));
        node = node.nextNode;
    }

})(elvishGenerator);