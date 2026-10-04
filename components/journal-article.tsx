import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { journalArticles } from "@/lib/data";
import { assetPath } from "@/lib/site";

type Article = (typeof journalArticles)[number];

export default function JournalArticle({ article }: { article: Article }) {
  return (
    <article className="journal-article-page">
      <div className="journal-article-breadcrumb"><Link href="/journal"><ArrowLeft size={14}/> BACK TO THE JOURNAL</Link><span>{article.tag}</span></div>
      <header className="journal-article-header"><span className="journal-article-overline">A NOTE FROM SATYAM <i/> {article.tag}</span><h1>{article.title}</h1><p>{article.intro}</p></header>
      <div className="journal-article-image"><Image src={assetPath(article.image)} alt="Jewellery editorial image" fill priority sizes="100vw"/><span>THE SATYAM JOURNAL · A GUIDE TO KEEP</span></div>
      <div className="journal-article-content"><div className="journal-article-sidebar"><span>IN THIS NOTE</span><p>{article.title}</p><span>A SHORT READ</span><Link href="/contact">Ask us in person <ArrowUpRight size={13}/></Link></div><div className="journal-article-body">{article.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="journal-article-quote"><span>✳</span><blockquote>Let the details become clear. Then choose what feels like you.</blockquote><small>SATYAM JEWELLERS · JABALPUR</small></div><p>For details about a specific design, please speak with the showroom team. This note is a starting point for a conversation and does not replace piece-specific guidance.</p><Link href="/collections" className="text-link">Continue exploring <ArrowUpRight size={15}/></Link></div></div>
      <div className="journal-article-end"><span>END OF NOTE</span><Link href="/journal">MORE FROM THE JOURNAL <ArrowUpRight size={13}/></Link></div>
    </article>
  );
}
