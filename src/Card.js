const Card = ({ number, suit }) => {
  const combo = (number) ? `${number}${suit}` : null;
  const color = (suit === '♦' || suit === '♥') ? 'card-red' : 'card-black';
  
  return (
    <td>
      <div className={color}>
        { combo }
      </div>
    </td>
  );
};

export default Card;