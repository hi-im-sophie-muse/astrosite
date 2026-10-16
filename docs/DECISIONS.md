# Decisions

## Path
Works in a folder window: 
Yes.

A phone layout: 
Good question - I'm curious to see how it adapts automatically. Otherwise, similar layout to a modern smartphone (Android) so the fit is optimal.

Link previews: 
No, unless needed for accessibility.

hosted audio:
on-site, re-encoded to .mp3 or similar. If size is an issue, I'll learn about what other options are there.

a keyboard menu: 
Thought about it. If lightweight and useful, yes, otherwise I assume someone who needs an on-screen keyboard will use a 3rd party one 

a 404 page?
Yes - static image. Maybe this is where the particles can reside, provided they're not extremely heavy. A bit of lag before encountering a 404 page isn't unusual, though.

## Sketch: desktop
What is on the desktop itself, 
.exe files (about, help, etc). and folder shortcuts (list of works, list of social media). Complete albums, notable single projects, and most recent piece will be the only items directly on the desktop, otherwise they'll be nested.

and what sits in a folder?
list of works, social media, featured works.

## Sketch: folder window
What does the folder look like, 
File explorer

and what happens when I open something in it?
Opens the associated .md, exactly like the current function.

## Sketch: phone
What does a phone show, with no dragging?
Honestly, I'm pleased with how it's presently handled so it's hard to figure out how to best handle or reinvent it. Maybe new windows open above older ones so users don't need to scroll too far down, in the event they open a massive amount at once.


## Glanimals
tamok accidentally pasted an unrelated message with the term ganimal, which is a nickname for a band that I discovered in ~2018, definitely not old. The takeaway from that, though, is that I looked into the small PG icon available from that link - its existence feels very reminiscent of early internet. It's post Win95 and I'm still on the fence about it; alternate option is a Clippy variant but that takes more work in terms of making it feel as alive as Clippy.

## The works
Tentatively, the 6 featured works on the primary site may be the first to go live here. Afterwards, backwards chronological order or any works that are very relevant (game works, works that highlight different genres)

## Kinds
Majority are singles (which I'd rather label as "" than "Single", "Standalone" if absolutely needed). Ludopastiche is an actual album. Pralbumatic and TT:Rescored are "unfinished albums" where I post and parade them as singles, but tag them appropriately. My game-related works also live that way - if I ever finish my own games, they'll be a full album, otherwise they reside like unfinished albums.

## Desktop or folder
Ludopastiche (the album, rather), whichever track is the most recent, demo reel track.

## Windows pushed off-screen
Can people shove windows away, 
Yes.

with a way back, 
Refresh/factory reset

or are they stopped at the edge?
I toyed with the idea of making an easter egg that celebrates the user if they open 5 windows and pushed them all away.

## Opening things
Single click or double click? 
Single: more intuitive for the modern user at the expense of geeks not getting the full effect but hopefully understanding that I have to cater to all user levels.

Which views (icons, list, details)?
Icons for desktop.
Folder - would actually be cool to be able to change between list view, icons, details (I don't remember if win95 had this feature already). Otherwise, list.

A desktop window or the work's own page?
Work's own page.

## Where the words live
Each work's own page? (Leaning now, final answer in II.2.)
Words live on their respective pages.

## Audio
How big is the full set of masters, 
Unmeasured. Currently large since they're .wav files, but I am only going to upload a very small amount of files on this site to begin with (primary goal is to get them to watch on YouTube)

and where could they live outside git?
google Drive or whereever else fitting if files are too large.

## Domain and hosting
Which address goes live,
Final site on hi.imsophiemuse.com / imsophiemuse.com

and do I stay on Netlify?
Potentially, to archive old site. Switcheroo, if you will.

## Sounds and motion
Any interface sounds at all (off until turned on)? 

Do the old site's particles return, 
That would be nice (probably for the about, as that's one of the locations they're at), but...

and how heavy can they be?
...they're damn heavy. If it turns out I can deploy them once and the cost is light, I'll deploy them, otherwise if they're sizable then they're unacceptable.

## About and contact
What goes in the bio, 
Bio exists, just needs tweaks. Static text.

and how do people reach me?
I push people towards my link aggregate so they can choose the social media platform they want to reach me on. Deprecated the email form I used to have, as people only used it to solicit website products rather than actual commentary.

## Licensing
Who may reuse the code, 
CC 3.0 - reuse with credit. It's either not copyrightable by default (I either copied it from you, which makes it uncopyrightable), or something so simple that there's no point in copyrighting it (taken from Astro tut, easy to write, etc.); I don't look to profit from the site construction itself, but it would be cool to have attribution.

and who may reuse the music and art?
Unless stated, works are considered copyrighted. More specifically: CC BY-NC-SA (commercial must discuss, non-commercial free to use and manipulate with credit and released under similar copyright rules). If practical, robots.txt will disallow access (to honest bots anyway, unethical ones don't care) to art/audio, and can only digest text material, including list of works.

## Analytics
Do I want to know what gets opened, 
Yes.

and how little can I count?
Many artists are very used to getting no views anyway - total visits is fine, unique visits would be useful. Any metrics beyond that (e.g. location) are unneeded.

# Questions from Desktop Site Plan

## Are these your 6: Unreachable, X88B88, Twilight Desert (IdleOn), 4 Seasons, Precipice and Ludopastiche? ("test, YMIR" looks like a placeholder, 4 Seasons appears twice, and EXISTENTIAL 77 is a separate button on the old site.) And are the credits for X88B88, Unreachable, Precipice and 4 Seasons right before they're featured?
Those are the 6, though I may swap some of them around so they're fresher. There is only one visible instance of 4 Seasons, and YMIR is a placeholder (not my song, but a song rec for anyone bothering to look at the code). Credits are after, originally they're on hover as a tooltip.

## Is Ludopastiche one album with a track list, or a series of separate pieces (a subfolder)?

One album with a track list. 4 Seasons is multimovement. Toontown Rescored, klei, Legends of IdleOn, and similar projects are series of pieces.

## Portfolio: a "Selected Works" folder (recommended), a pinned folder at the top of My Works, or a shortcut per work?
Selected works folder (which has a link to the larger folder with all works).  

## On a return visit: start clean like a Win95 boot (recommended), or reopen the last 3 windows?
Reopen last that was not maximized, if no other windows were open then boot clean. Leave last 3 minimized in taskbar if none were open but some were minimized.

## Within a visit: an 8-window cap with the "not enough memory" box, or no cap?
With the above rule active, cap 16.

## First visit: a small Welcome window with "Show this next time" (recommended), a readme.txt icon, or an empty desktop?
Welcome window (skinned as an alert dialog or the original welcome window if not heavy to create more templates, otherwise as a notepad is fine).

## Single click to open (recommended) or authentic double click?
Single

## Player look: Win95 CD Player (recommended), or a Winamp-style lookalike in your own art?
Winamp mimic - more recognizable, still had compat with Win95, and the original one offers customization. It's also partially open source.

## Instruments: is it worth turning the Google Doc's notes into one fixed list of instrument names? That's the real cost of the filter. And do all ~89 works go in eventually, or a curated set?
All will go on the site eventually, as most of my songs have been publicized at some point. I'm actually dreading having to do this part, but that's okay. Thinking of treating instruments as tags, of which the tags would be how one could search/filter. 

## The "J" key: keep only F6, or keep J only when a title bar has focus?
F6 only - J removed.

## Social links: period globe icons or real brand logos? New tab or same tab?
New tab. Globe icons with differences that hint at the real brand logos.

## Old site archive: a frozen copy at its own address, or just a link to the Wayback Machine?
Frozen copy, preferrably at netlify.

## Reset wording: "Restore Default Desktop" with an "Access is denied" joke, or your permissions joke?
Access is denied.

## Confetti and haptics: OK to drop them for pressed buttons plus optional, off-by-default Win95 sounds?
Yes to all.