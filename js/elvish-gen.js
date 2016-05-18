/**
 * Created by Jeff on 5/17/2016.
 */

var elvishGen = elvishGen || {};

(function(eg){

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

    eg.isVowel = function (value){
            return alphabet.vowels[value];
    };

    eg.isConsonant = function (value){
            return alphabet.consonants[value];
    };

    eg.isSupplementary = function(value) {
        return alphabet.supplementary[value];
    };

    function ElvishNode(middle, top, bottom, nextNode) {
        this.top = top;
        this.middle = middle;
        this.bottom = bottom;
        this.nextNode = nextNode;

        var that = this;

        this.topCount = function() {
            if(that.top) {
                return that.top.length;
            }
            return 0;
        };

        this.middleCount = function() {
            if(that.middle) {
                return that.middle.length;
            }
            return 0;
        };

        this.bottomCount = function () {
            if(that.bottom) {
                return that.bottom.length;
            }
            return 0;
        };

        this.totalLetterCount = function() {
            return that.topCount() + that.middleCount() + that.bottomCount();
        };

    }

    eg.removeFromFront = function (value, amountToRemove){
        return value.substring(amountToRemove, value.length);
    };

    function parseElvishNodes(characters) {
        // base case
        if(!characters || characters.length === 0){
            return undefined;
        }

        var node = new ElvishNode();

        // middle section
            // consonant || double consonant || supplementary
        var firstTwo = characters.substring(0, 2),
            isConsonant = eg.isConsonant(characters.charAt(0)),
            isDouble = firstTwo.charAt(0) === firstTwo.charAt(1),
            isDoubleConsonant = eg.isConsonant(firstTwo.charAt(0)) && eg.isConsonant(firstTwo.charAt(1)),
            isSupplementary = eg.isSupplementary(firstTwo);

        if((isDouble && isDoubleConsonant) || isSupplementary) {
            node.middle = firstTwo;
        } else if (isConsonant) {
            node.middle = characters.charAt(0);
        }

        characters = eg.removeFromFront(characters, node.middleCount());

        // bottom section
        // 'y' || silent 'e' || double 'y' || double 'e'
        firstTwo = characters.substring(0, 2),
        isDouble = firstTwo.charAt(0) === firstTwo.charAt(1);
        var isDoubleE = isDouble && firstTwo.charAt(0) === 'e',
            isDoubleY = isDouble && firstTwo.charAt(0) === 'y',
            isSilentE = !isDouble && characters.charAt(0) === 'e' && characters.length === 1;

        if(isDoubleE || isDoubleY){
            node.bottom = firstTwo;
        } else if(isSilentE) {
            node.bottom = characters.charAt(0);
        }

        characters = eg.removeFromFront(characters, node.bottomCount());

        // top section
        // vowel || double vowel
        firstTwo = characters.substring(0, 2),
        isDouble = firstTwo.charAt(0) === firstTwo.charAt(1);
        var isVowel = eg.isVowel(characters.charAt(0)),
            isDoubleVowel = isDouble && isVowel;

        if(isDoubleVowel) {
            node.top = firstTwo;
        } else if(isVowel) {
            node.top = characters.charAt(0);
        }

        characters = eg.removeFromFront(characters, node.topCount());

        // unrecognized character...
        // just stick it in the middle and continue
        if (node.totalLetterCount() === 0){
            node.middle = characters.charAt(0);
            characters = eg.removeFromFront(characters, 1);
        }

        //var remainingCharacters = characters.substring(node.totalLetterCount(),  characters.length);

        node.nextNode = parseElvishNodes(characters);

        return node;
    }

    var word = 'jeff';

    var nodes = parseElvishNodes(word);

})(elvishGen);