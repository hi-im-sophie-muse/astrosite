const paragraphs = ["<p>I’m a big believer in respecting one’s roots while not being afraid to branch out. On one hand, the classically trained        composer’s toolbox is one that I’m grateful to have. On the other hand, I am not afraid to defy the rules set by that school of thought if it meant allowing my music to soar higher in any way. All rules and no delinquency makes me a dull gal. If avantgardism was chaotic evil and strict neoclassicism was lawful good, I’d occupy all of the neutral spaces.</p>",
"<p>Randomization is a keen interest of mine. Anyone who has hit shuffle knows that while the original order will be reliably good, sometimes it feels nicer to shake things up. Rather than thinking about my work’s length as a straight line between A and B, there’s no line to be found anywhere. At times, I’ll create something that’s reminiscent of Musikalisches Würfelspiels. At other times, maybe the conductor will want to listen to a section over and over again, then suddenly move on to the following section (but only play half of it) before moving on once more. Oh, look, it’s an explanation of how I incorporate randomization, how much fun I get from composing these works (implied), a reference to how these types of random works often incorporate an uneven amount of both styles of randomization, and finally the conductor seems to want to go back one section…</p>",
"<p>Sometimes randomness shows up in my work through other forms. Humor is a great coping mechanism, but it seems to have become a part of my personality. A part of my humor is self-deprecating, another part of it is deadpan, and all of that is packaged and delivered in what the academics would call “finding humor using the incongruence theory” or, in better terms, absurd and surreal. To be more precise, imagine a non-[social media]* user finding a “funny [post]*” and deciding that it would make for great text for a song. Does any of that sound or feel odd? That’s exactly what my satirical compositions feel like. *...future-proofing myself for the second time in 3 months (check back often, maybe it'll change again!)</p>"];
const firstp = "I’m a composer, a musician, and as I’ve heard, I’m someone whose life resides outside of the fabled box of creative thinking.";
const lastp = "In classic non-classical fashion, feel free to randomize the order of the middle paragraphs, they will still convey what I’d love to tell you about my MO! Interactive works where the performers and/or listeners have creative control over their experience make me inexplicably happy to not only create, but to share"

function OK() {
  for (let i = paragraphs.length -1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i+1));
    let k = paragraphs[i];
    paragraphs[i] = paragraphs[j];
    paragraphs[j] = k;
  }
          let randomizedText = paragraphs.join("<br>");

    let finalText = firstp + "<br>" +randomizedText + lastp;
    document.getElementById("bio").innerHTML = finalText;

};
    document.querySelector('.button2')?.addEventListener('click', OK);