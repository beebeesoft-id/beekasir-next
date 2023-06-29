
import ComFooter from "@/component/footer"
import ComHeader from "@/component/header"

export default function PublicLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    
    return (
    <div> 
        <ComHeader/>
        {children}
        <ComFooter/>
    </div>
    )
  }