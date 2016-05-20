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

    // Common string functions (this is probably bad, might move this into separate object or namespace later)

    // figure out a better way to do this for all
    if(String.prototype.isVowel) {
        console.warn('function : String.prototype.isVowel already exists.')
    }

    String.prototype.isVowel = function (){
            return alphabet.vowels[this];
    };

    String.prototype.isSupplementary = function() {
        return alphabet.supplementary[this];
    };

    String.prototype.truncateFront = function (amountToRemove){
        return this.substring(amountToRemove, this.length);
    };

    String.prototype.take = function (numberOfCharacters) {
        return this.substring(0, numberOfCharacters);
    };

    String.prototype.first = function () {
        return this.charAt(0);
    };

    String.prototype.isDouble = function (character) {
        if(this.length !== 2) {
            return false;
        }

        var first = this.charAt(0),
            second = this.charAt(1);

        if(character) {
            return first === character && second === character;
        }

        return first === second;
    };

    String.prototype.isConsonant = function () {
        return alphabet.consonants[this];
    };

    String.prototype.isDoubleConsonant = function () {
        return this.isDouble() && this.first().isConsonant();
    };

    String.prototype.isDoubleVowel = function () {
        return this.isDouble() && this.first().isVowel();
    };

    // "Classes"

    function ElvishNode(top, middle, bottom, nextNode) {
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

    function ParserConfig () {

        // We may want to configure how the parser works at some point

    }

    function ElvishNodeParser(config) {
        this.config = config || new ParserConfig();

        var that = this;

        this.parse = function(characters) {
            // base case
            if(!characters || characters.length === 0){
                return undefined;
            }

            var node = new ElvishNode();
            var remaining = characters;

            remaining = that.tryFillMiddle(node, remaining);

            remaining = that.tryFillBottom(node, remaining);

            remaining = that.tryFillTop(node, remaining);

            // unrecognized character... just stick it in the middle and continue
            if (node.totalLetterCount() === 0){
                node.middle = remaining.first();
                remaining = remaining.truncateFront(1);
            }

            node.nextNode = that.parse(remaining);

            return node;
        };

        this.tryFillMiddle = function(node, characters){
            // middle section
            // consonant || double consonant || supplementary
            var firstTwo = characters.take(2);

            if(firstTwo.isDoubleConsonant() || firstTwo.isSupplementary()) {
                node.middle = firstTwo;
            } else if (characters.first().isConsonant()) {
                node.middle = characters.first();
            }

            return characters.truncateFront(node.middleCount());
        };

        this.tryFillBottom = function(node, characters) {
            // bottom section
            // 'y' || silent 'e' || double 'y' || double 'e'
            var firstTwo = characters.take(2);
            // TODO : find a more reliable way to determine silent e scenario
            var isSilentE = !firstTwo.isDouble() && characters.length === 1 && characters.first() === 'e';

            if(firstTwo.isDouble('e') || firstTwo.isDouble('y')){
                node.bottom = firstTwo;
            } else if(isSilentE || characters.first() === 'y') {
                node.bottom = characters.first();
            }

            return characters.truncateFront(node.bottomCount());
        };

        this.tryFillTop = function(node, characters) {
            // top section
            // vowel || double vowel
            var firstTwo = characters.take(2);

            if(firstTwo.isDoubleVowel()) {
                node.top = firstTwo;
            } else if(characters.first().isVowel()) {
                node.top = characters.first();
            }

            return characters.truncateFront(node.topCount());
        }
    }

    // The rest is temporary, have not wired up the UI
    // This simply demonstrates usage

    var word = 'sheldon';

    var parser = new ElvishNodeParser();

    var nodes = parser.parse(word);

    var node = nodes;

    while(node) {
        console.log((node.top || '-') + '|' + (node.middle || '-') + '|' + (node.bottom || '-'));
        node = node.nextNode;
    }

})(elvishGenerator);