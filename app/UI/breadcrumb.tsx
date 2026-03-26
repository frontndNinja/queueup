import Link from "next/link";
export default function Breadcrumb({ items }: { items: { label: string; href: string; }[]; }) {
    return (
        <div className="flex items-center gap-2">
            {items.map((item, index) => (
                index !== items.length - 1 ? (
                    <Link className="text-sm-p4 text-muted-foreground hover:text-primary" key={item.href} href={item.href}>{item.label}<span className="ml-2 text-sm-p4 text-muted-foreground/70">/</span></Link>
                ) : (
                    <span className="text-sm-p4 text-muted-foreground/70" key={item.href}>{item.label}</span>
                )
            ))}
        </div>
    );
}