/**
 * Created by Jeff on 5/17/2016.
 */

var elvishGen = elvishGen || {};

(function(eg){

    console.log("hello");

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

    function isVowel(value){
            return alphabet.vowels[value.charAt(0)];
    }

    function isConsonant(value){
            return alphabet.consonants[value.charAt(0)];
    }

    function isSupplementary(value) {
        return alphabet.supplementary[value];
    }

    function isSilentE(index, word){
        // typically a silent e is at the end of a word,
        // there are some contradictions to this logic but we won't worry about that right now
        return index === (word.length - 1);
    }

    function ElvishNode(middle, top, bottom, nextNode) {
        this.top = top;
        this.middle = middle;
        this.bottom = bottom;
        this.nextNode = nextNode;

        var that = this;

        this.letterCount = function() {
            var count = 0;

            if(that.top){
                count += that.top.length;
            }

            if(that.middle){
                count += that.middle.length;
            }

            if(that.bottom) {
                count += that.bottom.length;
            }

            return count;
        }
    }

    /*
    for(var i = 0; i < word.length; i++){
        var segment = word.charAt(i);
        var nextChar = word.charAt(i + 1) ;

        if(nextChar === segment || isSupplementary(segment + nextChar)) {
            segment += word.charAt(i + 1);
        }

        if(isVowel(segment)) {
            // up or down?
            if (segment == 'y' || (segment === 'e' && isSilentE(i, word))) {
                    currentNode.bottom = segment;
            } else if (segment) {
                    currentNode.top = segment;
            }
        } else {
            currentNode.middle = segment;
        }

        // we should skip, depending on how many letters were consolidated
        i += (currentNode.letterCount() - 1);
    }
    */

    // foreach letter

    function parseElvishNodes(characters) {
        if(!characters || characters.length === 0){
            return null;
        }

        var node = new ElvishNode();

        // top
            // vowel || or double vowel

        // middle
            // consonant

        // bottom
            // 'y' or silent 'e'

        node.middle = characters.charAt(0);

        var remainingCharacters = characters.substring(node.letterCount(),  characters.length);

        node.nextNode = parseElvishNodes(remainingCharacters);

        return node;
    }

    var word = 'jeff';

    var nodes = parseElvishNodes(word);

})(elvishGen);