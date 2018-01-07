![alt text](https://raw.githubusercontent.com/masterjeef/elvish-gen/master/toQuenya.jpg "Tengwar Transcriber")

# Tengwar Transcriber

Tengwar is a type of Elvish scripting. My transcriber simply converts English characters to Tengwar, it will not translate English to Tengwar.
This tool is useful for a few special cases, such as writing your name in Tengwar.

## Getting Started

1. Install npm if you do not already have it
2. Run `npm install` in the project's root directory
3. Run `npm start` 

This will start webpack-dev-server which will serve the production ready files from the `./dist` directory. The webpack-dev-server will also watch the files for changes, and automatically build the bundle if anything changes.

## My Source

https://imgur.com/gallery/ATqDS

How I interpret 'r' :
`as in 'car'` - means 'r' is preceded by a vowel
`as in 'red'` - means everything else

The 'r' variation could also be a trilled 'r' or a non trilled 'r' (according to the spoken Elvish). More research is needed.

How I identify silent 'e' :
Most cases of a silent 'e' occur at the end of a word. This is currently how my algorithm works.

Known Issues :
* Handling 'y' consonant case
* Alternate forms of 'z' and 's'
* Two cases for 'r'
* Missing 'x' character
* Missing 'h' character
* Missing 'nd' character

## Other Helpful Resources

* http://www.forodrim.org/daeron/teng-sin.pdf
* https://imgur.com/gallery/MPN6U
