FontFunFriday
=============

###A Adobe Indesign script for font nerds.

##What's that all about?
When you scribble a font, you quickly come to a point where you need a base line or a guide for the x height and for the descenders …
But where to place them? This decision takes influence on the whole font design. So why don't you check out the guides of some famous fonts?
This script creates a small booklet with the metrics of 22 fonts and for each font 96 fields for 96 characters (which is a little more than a German basic keyboard layout).

##Install this script
Clone thie repository int your `~/Library/Preferences/Adobe InDesign/Version 7.5/en_GB/Scripts/Scripts Panel/` folder or download the zipped files and unzip them to this destination.

##Data Sources
There are three files which provied data. The script depends on GlyphList-Unicode.json and FontList.json. But first let's take a look on the file where everthing started:

###GlyphList.txt
This files contains 96 characters separated by a break row (or '\r'). The original file contains: *a, ä, b, c, d, e, f, g, h, i, j, k, l, m, n, o, ö, p, q, r, s, t, u, ü, v, w, x, y, z, ß, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ,, ., -, `, +, #, ^, @, A, Ä, B, C, D, E, F, G, H, I, J, K, L, M, N, O, Ö, P, Q, R, S, T, U, Ü, V, W, X, Y, Z, ?, !, ", §, $, %, &, /, (, ), =, ;, :, _, backtick, * , ', °, €*.

And looks like this:

    a
    ä
    b
    c
    … (the other 91 characters)
    €

**Note: If you change these characters, please be sure to have 96, because the layout is optimized for this amount!**

When you have done any changes in this file you need to format it into an .json file and add the unicode information for each character. Have fun! Just kidding. For god sake I wrote the python script `ConvertToUnicodeIntoJSON.py`. So open a terminal, change directory to `~/Library/Preferences/Adobe InDesign/Version 7.5/en_GB/Scripts/Scripts Panel/FontFunFriday/`
(be careful: the 'en_GB' depends on the language of your version of Indesign, would be 'de_DE' if you run a German version on your system) and type in `python ConvertToUnicodeIntoJSON.py` and the .txt is parsed into a .json file with all the additional information under the name `GlyphList-Unicode.json`.

###GlyphList-Unicode.json
In the last chapter you read how to generate this file, but what's inside? 

Let's have a look:

    [
      {
        "glyph": "a",
        "name": "LATIN SMALL LETTER A",
        "number": "0061"
      },
      {
        "glyph": "ä",
        "name": "LATIN SMALL LETTER A WITH DIAERESIS",
        "number": "00e4"
      },
      … (I think you'll get the point)
      {
        "glyph": "€",
        "name": "EURO SIGN",
        "number": "20ac"
      }
    ]

**Note: If you edit this file, don't destroy the .json format. If this happends only god can save you! Naw, just run the python script from the last chapter.

###FontList.json
In this file keeps the fonts with their metrics information. This collection contains the information of these fonts: *Aachen Std, Adobe Garamond Pro, Andale Mono, Arial, Berthold Akzidenz Grotesk BE, Bickham Script Pro, Comic Sans MS, Cooper Std, Courier New, Georgia, Helvetica Neue, ITC Avant Garde Gothic Std Medium, Impact, Livory Regular, Meslo LG L DZ, Myriad Pro, Neutra Text, Novel Pro, Rooney Regular, Times New Roman, Trajan Pro.*

Take a look:

    [
      {
        "FontName": "Aachen Std", 
        "HkxpArray": [
          1.0, 
          1.0, 
          0.73512252042006998, 
          -0.26371061843640609
        ]
      }, 
      {
        "FontName": "Adobe Garamond Pro", 
        "HkxpArray": [
          1.0, 
          1.0784313725490196, 
          0.59879336349924583, 
          -0.38914027149321267
        ]
      }, 
      … (Yes, here are more fonts!)
      {
        "FontName": "Trajan Pro", 
        "HkxpArray": [
          1.0, 
          0.84993359893758302, 
          0.84993359893758302, 
          -0.0039840637450199202
        ]
      }
    ]

There are two ways to make your own `FontList.json`. 

1.    You open the font of your choice the font editor software of your choice. Then mesure the height of the *H, k and x* and the lowest point of *p*. Then divide every value through the height of *H* and put these values into the `HkxpArray`.

2.    You open your full version of [glyphsapp](http://glyphsapp.com) clone my [Glyphs-Scripts Repository](https://github.com/PDXIII/Glyphs-Scripts) into your Glyphs script folder under `~/Library/Application Support/Glyphs/Scripts/` open all the fonts you want the metrics from and run the `ExportHkxpMetrics.py` script. It exports all the metrics the way it should be into a file on your desktop under `~/Desktop/Metrics.json`. All need to do in addition is to rename it into `FontList.json` and move it into your `~/Library/Preferences/Adobe InDesign/Version 7.5/en_GB/Scripts/Scripts Panel/FontFunFriday/` folder.

The second way has a longer discription but is the faster way (but requires a full version of [glyphsapp](http://glyphsapp.com)).

##Open Adobe Indesign and run the script
I am sure you know how! If you copied /cloned the repository into the right folder, it will appear in your skript panel under `FontFunFriday.jsx`. A doubleclick will start the script.

##Unicode Information
After sarting the script a pop up will appear asking how you like the unicode information should be displayed. There are two options:

1    `a u+00061` will make a tile for scribbling for every character in the GlyphList with the character itself and the unicode number below:
2    `latin small letter a` will make a tile for scribbling, too, but puts the unicode name inside this tile.

Try them both! 

##Grid & Masterspread
##Lines and Metrics Infoformation
##Styles
##Export
##Thanx!